<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="书名">
        <el-input v-model="searchForm.title" placeholder="请输入书名" clearable />
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="searchForm.author" placeholder="请输入作者" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="可借" value="available" />
          <el-option label="已借" value="borrowed" />
          <el-option label="预约" value="reserved" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增图书</el-button>
    </div>

    <!-- 图书列表 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="书名" min-width="150" />
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column prop="publisher" label="出版社" width="150" />
      <el-table-column prop="price" label="价格" width="80">
        <template slot-scope="scope">¥{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publish_date" label="出版日期" width="120" />
      <el-table-column prop="isbn" label="ISBN" width="150" />
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.limit"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="formData.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="formData.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="formData.price" type="number" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="可借" value="available" />
            <el-option label="已借" value="borrowed" />
            <el-option label="预约" value="reserved" />
          </el-select>
        </el-form-item>
        <el-form-item label="出版日期" prop="publish_date">
          <el-date-picker v-model="formData.publish_date" type="date" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入简介" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog title="图书详情" :visible.sync="detailVisible" width="500px">
      <el-descriptions :column="2" :data="detailData">
        <el-descriptions-item label="书名">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ detailData.author }}</el-descriptions-item>
        <el-descriptions-item label="出版社">{{ detailData.publisher }}</el-descriptions-item>
        <el-descriptions-item label="价格">¥{{ detailData.price }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailData.status)">
            {{ getStatusText(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="出版日期">{{ detailData.publish_date }}</el-descriptions-item>
        <el-descriptions-item label="ISBN">{{ detailData.isbn }}</el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">{{ detailData.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getBookList, createBook, updateBook, deleteBook, getBookDetail } from '@/api/book'

export default {
  name: 'BookList',
  data() {
    return {
      // 搜索表单
      searchForm: {
        title: '',
        author: '',
        status: ''
      },
      // 表格数据
      tableData: [],
      // 分页参数
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      // 对话框状态
      dialogVisible: false,
      detailVisible: false,
      // 表单数据
      formData: {
        id: '',
        title: '',
        author: '',
        publisher: '',
        price: '',
        status: 'available',
        publish_date: '',
        description: ''
      },
      // 详情数据
      detailData: {},
      // 表单验证规则
      formRules: {
        title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取状态对应的标签类型
    getStatusType(status) {
      const types = {
        available: 'success',
        borrowed: 'warning',
        reserved: 'info'
      }
      return types[status] || 'default'
    },
    // 获取状态中文文本
    getStatusText(status) {
      const texts = {
        available: '可借',
        borrowed: '已借',
        reserved: '预约'
      }
      return texts[status] || status
    },
    // 获取图书列表
    async fetchData() {
      const params = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        ...this.searchForm
      }
      try {
        const response = await getBookList(params)
        this.tableData = response.data.items
        this.pagination.total = response.data.total
      } catch (error) {
        this.$message.error('获取图书列表失败')
      }
    },
    // 搜索
    handleSearch() {
      this.pagination.page = 1
      this.fetchData()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        title: '',
        author: '',
        status: ''
      }
      this.pagination.page = 1
      this.fetchData()
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.fetchData()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    },
    // 新增图书
    handleAdd() {
      this.dialogTitle = '新增图书'
      this.formData = {
        id: '',
        title: '',
        author: '',
        publisher: '',
        price: '',
        status: 'available',
        publish_date: '',
        description: ''
      }
      this.dialogVisible = true
    },
    // 编辑图书
    async handleEdit(row) {
      this.dialogTitle = '编辑图书'
      try {
        const response = await getBookDetail(row.id)
        this.formData = response.data
        this.dialogVisible = true
      } catch (error) {
        this.$message.error('获取图书详情失败')
      }
    },
    // 查看图书详情
    async handleView(row) {
      try {
        const response = await getBookDetail(row.id)
        this.detailData = response.data
        this.detailVisible = true
      } catch (error) {
        this.$message.error('获取图书详情失败')
      }
    },
    // 删除图书
    handleDelete(row) {
      this.$confirm('确定要删除这本图书吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deleteBook(row.id)
          this.$message.success('删除成功')
          this.fetchData()
        } catch (error) {
          this.$message.error('删除失败')
        }
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate(async(valid) => {
        if (valid) {
          try {
            if (this.formData.id) {
              await updateBook(this.formData.id, this.formData)
              this.$message.success('更新成功')
            } else {
              await createBook(this.formData)
              this.$message.success('新增成功')
            }
            this.dialogVisible = false
            this.fetchData()
          } catch (error) {
            this.$message.error(this.formData.id ? '更新失败' : '新增失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 16px;
}
</style>
