<template>
	<el-card class="card">
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 搜索框 -->
		<el-row class="searchRow">
			<el-col :span="24">
				<el-input
					v-model="searchValue"
					clearable
					placeholder="请输入内容"
					class="searchInput">
					<el-button
					@click="handleSearch"
					slot="append"
					icon="el-icon-search"></el-button>
				</el-input>
				<el-button @click="addUserDialogFormVisible = true" type="success" plain>添加</el-button>
			</el-col>
		</el-row>
		<!-- 表格 -->
		<el-table
			border
			stripe
			:data="data"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
    	</el-table-column>
			<el-table-column
				prop="username"
				label="姓名"
				width="180">
			</el-table-column>
			<el-table-column
				prop="email"
				label="邮箱"
				width="180">
			</el-table-column>
			<el-table-column
				prop="mobile"
				label="电话"
				width="180">
			</el-table-column>
			<el-table-column
				label="时间"
				width="180">
				<template slot-scope="scope">
					{{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
				</template>
			</el-table-column>
			<el-table-column 
				label="用户状态"
				width="80">
			  <template slot-scope="scope">
          <!-- {{ scope.row.mg_state }} -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>

			</el-table-column>
			<el-table-column
			label="操作">
				<template slot-scope="scope">
          <!-- scope.row 是当前行绑定的数据对象 -->
           <!-- {{ scope.$index }} -->
					<el-button
						@click="openEditDialog(scope.row)"
						type="primary"
						icon="el-icon-edit"
						size="mini"
						plain>
					</el-button>
					<el-button
						@click="handleDelete(scope.row.id)"
						type="danger"
						icon="el-icon-delete"
						size="mini"
						plain>
					</el-button>
					<el-button
						type="success"
						icon="el-icon-check"
						size="mini"
						plain>
					</el-button>
        </template>
			</el-table-column>
    </el-table>
		<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      :page-sizes="[2, 4, 6, 8]"
      :pager-count="9"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
		<!-- 添加用户的对话框 -->
		 <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogFormVisible">
      <el-form
				ref="addForm"
				:rules="rules"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
		<!-- 编辑用户对话框 -->
		<el-dialog
			@close="handleEditDialogClose"
      title="修改用户"
      :visible.sync="editUserDialogFormVisible">
      <el-form
				ref="editForm"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
	</el-card>
</template>

<script>
// import axios from 'axios';

export default {
	data() {
		return {
			data: [],
			pagenum: 1,
			pagesize: 4,
			count: 0,
			// 绑定搜索文本框
			searchValue: '',
			form: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			// 表单验证规则
			rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
				]
			},
			// 控制添加用户对话框的显示隐藏
			addUserDialogFormVisible: false,
			// 控制编辑用户对话框的显示隐藏
			editUserDialogFormVisible: false
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		async loadData() {
			var token = sessionStorage.getItem('token');

			this.$http.defaults.headers.common['Authorization'] = token;

			var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
			var { meta: { status, msg } } = response.data;
      if (status === 200) {
				// 获取总共多少条数据
				this.count = response.data.data.total;
        this.data = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
		},
		// 分页的方法
		 handleSizeChange(val) {
			 // 每条页数发生变化
			 this.pagesize = val;
			 this.loadData();
       console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
				// 页码发生变化时
				this.pagenum = val;
				this.loadData();
        console.log(`当前页: ${val}`);
			},
			// 搜索的方法
			handleSearch() {
				this.loadData();
			},
			// handleAdd 添加数据
			async handleAdd() {
				const response = await this.$http.post('users', this.form);
				// 判断是否成功
				const { data: { meta: { status, msg } } } = response;
				if(status === 201) {
					// 添加成功
					// 提示
					this.$message.success(msg);
					// 关闭对话框
					this.addUserDialogFormVisible = false;
					// 重新加载数据
					this.loadData();
					// 还原表单默认值
					this.$refs.addForm.resetFields();
					// for (var key in this.form) {
          // 	this.form[key] = '';
        
				} else {
					// 添加失败
					this.$message.error(msg);
				}
			},
			// 点击编辑按钮获取当前行的数据
			openEditDialog(user) {
				// 显示对话框
				this.editUserDialogFormVisible = true;
				// console.log(user);
				this.form.username = user.username;
				this.form.mobile = user.mobile;
				this.form.email = user.email;
				// 存储用户的id
				this.form.id = user.id;
    },
			// 点击编辑对话框确定按钮
			async handleEdit() {
				const response = await this.$http.put(`users/${this.form.id}`, {
					email: this.form.email,
					mobile: this.form.mobile
				});
				// 判断是否成功
				const { meta: { status, msg } } = response.data;
				if(status === 200) {
					// 修改成功
					// 提示
					this.$message.success(msg);
					// 关闭窗口
					this.editUserDialogFormVisible = false;
					// 重新加载数据
					this.loadData();
					// 重置表单
					for (var key in this.form) {
						this.form[key] = '';
					}

				} else {
					// 修改失败
					this.$message.error(msg);
				}
			},
			// 关闭编辑对话框的时候执行
			handleEditDialogClose() {
				console.log('123');
				// this.editUserDialogFormVisible = false;
				// 清空表单数据
				for (var key in this.form) {
					this.form[key] = '';
				}
			},
			// 点击删除按钮
			async handleDelete(id) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
          type: 'success',
          message: '删除成功!'
          });
				const response = await this.$http.delete(`users/${id}`);
				// 判断是否删除成功
				const { meta: { status, msg } } = response.data;
				if(status === 200) {
					if (this.data.length === 1 && this.pagenum !== 1) {
              this.pagenum--;
              
            }
						// 重新加载数据
            this.loadData();
						// 提示
						this.$message.success(msg);
				} else {
					this.$message.error(msg);
				}
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });  
				});      
			}
	}
};
</script>

<style>
    .card {
        height: 100%;
    }
		.searchInput {
			width: 300px;
		}
		.searchRow {
			margin-top: 10px;
			margin-bottom: 10px;
		}
</style>
