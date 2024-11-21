<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input v-model="tempData.name" label="姓名" />
        <q-input v-model="tempData.age" label="年齡" />
        <q-btn color="primary" class="q-mt-md" @click="clickSubmitButton()">{{submitButtonText}}</q-btn>
      </div>
      <q-table
      flat
      bordered
      ref="tableRef"
      :rows="blockData"
      :columns="(tableConfig as QTableProps['columns'])"
      row-key="id"
      hide-pagination
      separator="cell"
      :rows-per-page-options="[0]"
      >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th></q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          style="min-width: 120px"
          >
          <div>{{ col.value }}</div>
        </q-td>
        <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
          <q-btn
          @click="handleClickOption(btn, props.row)"
          v-for="(btn, index) in tableButtons"
          :key="index"
          size="sm"
          color="grey-6"
          round
          dense
          :icon="btn.icon"
          class="q-ml-md"
          padding="5px 5px"
          >
          <q-tooltip
          transition-show="scale"
          transition-hide="scale"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
          >
          {{ btn.label }}
        </q-tooltip>
      </q-btn>
    </q-td>
  </q-tr>
</template>
<template v-slot:no-data="{ icon }">
  <div
  class="full-width row flex-center items-center text-primary q-gutter-sm"
  style="font-size: 18px"
  >
  <q-icon size="2em" :name="icon" />
  <span> 無相關資料 </span>
</div>
</template>
</q-table>
</div>
</q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { QTableProps, useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';

interface UserData {
  id: string;
  name: string;
  age: number;
}

type UserDataWithoutId = Omit<UserData, 'id'>;

interface btnType {
  label: string;
  icon: string;
  status: string;
}

const $q = useQuasar()

const blockData = ref<UserDataWithoutId[]>([
{
  name: 'test',
  age: 25,
},
]);
const tableConfig = ref([
{
  label: '姓名',
  name: 'name',
  field: 'name',
  align: 'left',
},
{
  label: '年齡',
  name: 'age',
  field: 'age',
  align: 'left',
},
]);
const tableButtons = ref<btnType[]>([
{
  label: '編輯',
  icon: 'edit',
  status: 'edit',
},
{
  label: '刪除',
  icon: 'delete',
  status: 'delete',
},
]);

const tempData = ref({
  id: '',
  name: '',
  age: '',
});

const submitButtonText = computed(() => tempData.value.id ? '更新' : '新增')

const api = {
  get: () => axios.get('https://dahua.metcfire.com.tw/api/CRUDTest/a'),
  post: (user: UserDataWithoutId) => axios.post('https://dahua.metcfire.com.tw/api/CRUDTest', user),
  patch: (user: UserData) => axios.patch('https://dahua.metcfire.com.tw/api/CRUDTest', user),
  delete: (id: string) => axios.delete(`https://dahua.metcfire.com.tw/api/CRUDTest/${id}`),
}

const loadData = async () => {
  $q.loading.show()

  try {
    const { data } = await api.get()
    blockData.value = data
  } catch(error) {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
  } finally {
    $q.loading.hide()
  }
}

const createData = async () => {
  $q.loading.show()

  try {
    await api.post({
      name: tempData.value.name,
      age: Number(tempData.value.age),
    })
    await loadData()
  } catch(error) {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
  } finally {
    $q.loading.hide()
  }
}

const updateData = async () => {
  $q.loading.show()

  try {
    await api.patch({
      id: tempData.value.id,
      name: tempData.value.name,
      age: Number(tempData.value.age),
    })
    await loadData()
  } catch(error) {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
  } finally {
    $q.loading.hide()
  }
}

const deleteData = async (id: string) => {
  $q.loading.show()

  try {
    await api.delete(id)
    await loadData()
  } catch(error) {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
  } finally {
    $q.loading.hide()
  }
}

const clickSubmitButton = async () => {
  if (tempData.value.id) {
    await updateData()
  } else {
    await createData()
  }
  // clear data
  tempData.value.id = ''
  tempData.value.name = ''
  tempData.value.age = ''
  loadData()
}

function handleClickOption(btn: btnType, data: any) {
  switch (btn.status) {
    case 'edit':
      tempData.value.id = data.id
      tempData.value.name = data.name
      tempData.value.age = data.age
    break;
    case 'delete':
      deleteData(data.id).then(() => {
        $q.notify({
          type: 'positive',
          message: '刪除成功',
        })
        loadData()
      })
    break;
  }
}

onMounted(loadData)
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
