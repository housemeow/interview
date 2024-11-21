import { UserData } from 'src/types/userTypes';
import { defineStore } from 'pinia';
import userApi from '../api/userApi';

export const useUserStore = defineStore('user', {
  state: () => ({
    blockData: [] as Array<UserData>,
    tempData: {
      id: '',
      name: '',
      age: '',
    },
  }),
  actions: {
    async loadData() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const { data } = await userApi.get();
        this.blockData = data;
      } catch (error) {
        throw new Error(error.message || 'Failed to load data');
      }
    },
    async createData() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        await userApi.post({
          name: this.tempData.name,
          age: Number(this.tempData.age),
        });
        this.clearTempData();
        await this.loadData();
      } catch (error) {
        throw new Error(error.message || 'Failed to create data');
      }
    },
    async updateData() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        await userApi.patch({
          id: this.tempData.id,
          name: this.tempData.name,
          age: Number(this.tempData.age),
        });
        this.clearTempData();
        await this.loadData();
      } catch (error) {
        throw new Error(error.message || 'Failed to update data');
      }
    },
    async deleteData(id: string) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        await userApi.delete(id);
        await this.loadData();
      } catch (error) {
        throw new Error(error.message || 'Failed to delete data');
      }
    },
    clearTempData() {
      this.tempData = {
        id: '',
        name: '',
        age: '',
      };
    },
  },
});
