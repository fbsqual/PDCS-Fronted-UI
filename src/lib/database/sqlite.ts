'use client'

import initSqlJs, { Database, SqlJsStatic } from 'sql.js'

/**
 * SQLite数据库管理类
 * 提供浏览器端SQLite数据库操作功能
 */
export class SQLiteManager {
  private static instance: SQLiteManager
  private SQL: SqlJsStatic | null = null
  private db: Database | null = null
  private isInitialized = false

  /**
   * 获取单例实例
   */
  static getInstance(): SQLiteManager {
    if (!SQLiteManager.instance) {
      SQLiteManager.instance = new SQLiteManager()
    }
    return SQLiteManager.instance
  }

  /**
   * 初始化SQLite
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    try {
      // 初始化sql.js
      this.SQL = await initSqlJs({
        // 从CDN加载wasm文件
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      })

      // 尝试从localStorage加载现有数据库
      const savedDb = localStorage.getItem('sqlite-db')
      if (savedDb) {
        const uint8Array = new Uint8Array(
          atob(savedDb)
            .split('')
            .map(char => char.charCodeAt(0))
        )
        this.db = new this.SQL.Database(uint8Array)
      } else {
        // 创建新数据库
        this.db = new this.SQL.Database()
        await this.createTables()
      }

      this.isInitialized = true
      console.log('SQLite initialized successfully')
    } catch (error) {
      console.error('Failed to initialize SQLite:', error)
      throw error
    }
  }

  /**
   * 创建默认表结构
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    // 创建用户表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建设置表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT DEFAULT 'string',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建日志表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建文件表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        size INTEGER NOT NULL,
        content BLOB,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 插入默认设置
    this.db.run(`
      INSERT OR IGNORE INTO settings (key, value, type) VALUES 
      ('theme', 'system', 'string'),
      ('language', 'zh-CN', 'string'),
      ('auto_save', 'true', 'boolean'),
      ('debug_mode', 'false', 'boolean')
    `)

    await this.saveToStorage()
  }

  /**
   * 保存数据库到localStorage
   */
  async saveToStorage(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const data = this.db.export()
      const base64 = btoa(String.fromCharCode(...data))
      localStorage.setItem('sqlite-db', base64)
    } catch (error) {
      console.error('Failed to save database to storage:', error)
      throw error
    }
  }

  /**
   * 执行SQL查询
   */
  query(sql: string, params: any[] = []): any[] {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const stmt = this.db.prepare(sql)
      const results: any[] = []

      while (stmt.step()) {
        results.push(stmt.getAsObject())
      }

      stmt.free()
      return results
    } catch (error) {
      console.error('Query failed:', error)
      throw error
    }
  }

  /**
   * 执行SQL命令（INSERT, UPDATE, DELETE）
   */
  run(sql: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    try {
      const stmt = this.db.prepare(sql)
      stmt.run(params)
      
      const result = {
        lastInsertRowid: this.db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0] as number || 0,
        changes: this.db.getRowsModified()
      }
      
      stmt.free()
      
      // 自动保存到localStorage
      this.saveToStorage()
      
      return result
    } catch (error) {
      console.error('Run failed:', error)
      throw error
    }
  }

  /**
   * 开始事务
   */
  beginTransaction(): void {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    this.db.run('BEGIN TRANSACTION')
  }

  /**
   * 提交事务
   */
  commit(): void {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    this.db.run('COMMIT')
    this.saveToStorage()
  }

  /**
   * 回滚事务
   */
  rollback(): void {
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    this.db.run('ROLLBACK')
  }

  /**
   * 获取表信息
   */
  getTableInfo(tableName: string): any[] {
    return this.query(`PRAGMA table_info(${tableName})`)
  }

  /**
   * 获取所有表名
   */
  getTables(): string[] {
    const results = this.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `)
    return results.map(row => row.name)
  }

  /**
   * 导出数据库为JSON
   */
  exportToJSON(): Record<string, any[]> {
    const tables = this.getTables()
    const data: Record<string, any[]> = {}

    for (const table of tables) {
      data[table] = this.query(`SELECT * FROM ${table}`)
    }

    return data
  }

  /**
   * 从JSON导入数据
   */
  importFromJSON(data: Record<string, any[]>): void {
    this.beginTransaction()

    try {
      for (const [tableName, rows] of Object.entries(data)) {
        // 清空表
        this.run(`DELETE FROM ${tableName}`)

        // 插入数据
        if (rows.length > 0) {
          const columns = Object.keys(rows[0])
          const placeholders = columns.map(() => '?').join(', ')
          const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`

          for (const row of rows) {
            const values = columns.map(col => row[col])
            this.run(sql, values)
          }
        }
      }

      this.commit()
    } catch (error) {
      this.rollback()
      throw error
    }
  }

  /**
   * 清空数据库
   */
  clearDatabase(): void {
    const tables = this.getTables()
    
    this.beginTransaction()
    
    try {
      for (const table of tables) {
        this.run(`DELETE FROM ${table}`)
      }
      this.commit()
    } catch (error) {
      this.rollback()
      throw error
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      this.isInitialized = false
    }
  }

  /**
   * 获取数据库大小（字节）
   */
  getDatabaseSize(): number {
    const savedDb = localStorage.getItem('sqlite-db')
    return savedDb ? savedDb.length : 0
  }

  /**
   * 检查数据库是否已初始化
   */
  isReady(): boolean {
    return this.isInitialized && this.db !== null
  }
}

/**
 * 获取SQLite管理器实例
 */
export const sqliteManager = SQLiteManager.getInstance()
