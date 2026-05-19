import { api } from './api.js';

export async function createSchedule(payload) {
  const { data } = await api.post('/schedule', payload);
  return data;
}

export async function listMySchedules() {
  const { data } = await api.get('/schedule');
  return data.items;
}

export async function cancelSchedule(id) {
  const { data } = await api.delete(`/schedule/${id}`);
  return data;
}

export async function listAllSchedules() {
  const { data } = await api.get('/schedule/admin');
  return data.items;
}

export async function updateScheduleStatus(id, status) {
  const { data } = await api.patch(`/schedule/${id}/status`, { status });
  return data;
}
