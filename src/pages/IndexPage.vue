<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input ref="nameRef" v-model="userStore.tempData.name" label="姓名" :rules="[val => !!val || '姓名不能為空']" />
        <q-input ref="ageRef" v-model="userStore.tempData.age" label="年齡" :rules="[val => !!val || '年齡不能為空', val => !isNaN(val) || '年齡必須是數字']" />
        <q-btn color="primary" class="q-mt-md" @click="clickSubmitButton()" :disable="submitButtonDisabled">{{submitButtonText}}</q-btn>
      </div>
      <q-table
      flat
      bordered
      ref="tableRef"
      :rows="userStore.blockData"
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
import { QInput, QTableProps, useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';

interface btnType {
  label: string;
  icon: string;
  status: string;
}

const $q = useQuasar()

const nameRef = ref<QInput | null>(null)
const ageRef = ref<QInput | null>(null)

const tableConfig = ref([
{
  label: '姓名',
  name: 'name',
  field: 'name',
  align: 'left',
  sortable: true,
},
{
  label: '年齡',
  name: 'age',
  field: 'age',
  align: 'left',
  sortable: true,
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

const userStore = useUserStore()
const submitButtonText = computed(() => userStore.tempData.id ? '更新' : '新增')
const submitButtonDisabled = computed(() => {
  return !userStore.tempData.name || !userStore.tempData.age || nameRef.value?.hasError || ageRef.value?.hasError
})

const clickSubmitButton = async () => {
  $q.loading.show()
  try {
    if (userStore.tempData.id) {
      await userStore.updateData();
      $q.notify({ type: 'positive', message: '更新成功' });
    } else {
      await userStore.createData();
      $q.notify({ type: 'positive', message: '新增成功' });
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message });
  } finally {
    $q.loading.hide()
  }
}

function handleClickOption(btn: btnType, data: any) {
  switch (btn.status) {
    case 'edit':
      userStore.tempData.id = data.id;
      userStore.tempData.name = data.name;
      userStore.tempData.age = data.age;
      break;
    case 'delete':
      $q.dialog({
        title: '提示',
        message: '是否確定刪除該筆資料？',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        $q.loading.show()
        try {
          await userStore.deleteData(data.id);
          $q.notify({ type: 'positive', message: '刪除成功' });
        } catch (error) {
          $q.notify({ type: 'negative', message: error.message });
        } finally {
          $q.loading.hide()
        }
      });
      break;
  }
}

onMounted(async() => {
  $q.loading.show()
  try {
    await userStore.loadData()
  } catch(error) {
    $q.notify({ type: 'negative', message: error.message });
  } finally {
    $q.loading.hide()
  }
});
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
