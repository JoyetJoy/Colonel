import { create } from 'zustand';

export const useMastersStore = create((set) => ({
  branches: [
    { id: 1, name: 'Main Branch', address: '123 Main St', location: 'City Center', pincode: 123456 },
    { id: 2, name: 'North Branch', address: '456 North Ave', location: 'North Side', pincode: 654321 },
  ],
  jobs: [
    { id: 1, name: 'Security Guard', description: 'Guards the premises', branchId: 1 },
  ],
  designations: [
    { id: 1, name: 'Senior Guard', branchId: 1 },
  ],
  areas: [
    { id: 1, name: 'North Zone', branchId: 1 },
  ],
  
  addBranch: (branch) => set((state) => ({ branches: [...state.branches, { ...branch, id: Date.now() }] })),
  updateBranch: (id, updated) => set((state) => ({ branches: state.branches.map(b => b.id === id ? { ...b, ...updated } : b) })),
  deleteBranch: (id) => set((state) => ({ branches: state.branches.filter(b => b.id !== id) })),

  addJob: (job) => set((state) => ({ jobs: [...state.jobs, { ...job, id: Date.now() }] })),
  updateJob: (id, updated) => set((state) => ({ jobs: state.jobs.map(j => j.id === id ? { ...j, ...updated } : j) })),
  deleteJob: (id) => set((state) => ({ jobs: state.jobs.filter(j => j.id !== id) })),

  addDesignation: (desig) => set((state) => ({ designations: [...state.designations, { ...desig, id: Date.now() }] })),
  updateDesignation: (id, updated) => set((state) => ({ designations: state.designations.map(d => d.id === id ? { ...d, ...updated } : d) })),
  deleteDesignation: (id) => set((state) => ({ designations: state.designations.filter(d => d.id !== id) })),

  addArea: (area) => set((state) => ({ areas: [...state.areas, { ...area, id: Date.now() }] })),
  updateArea: (id, updated) => set((state) => ({ areas: state.areas.map(a => a.id === id ? { ...a, ...updated } : a) })),
  deleteArea: (id) => set((state) => ({ areas: state.areas.filter(a => a.id !== id) })),
}));
