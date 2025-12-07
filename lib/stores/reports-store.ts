import { create } from "zustand";

// Type for marker data
export interface MarkerData {
  id: number;
  coordinates: [number, number]; // [longitude, latitude]
  title: string;
  description: string;
  photos: string[];
}

interface ReportsStore {
  userReports: MarkerData[];
  addReport: (report: Omit<MarkerData, "id">) => void;
  removeReport: (id: number) => void;
  clearReports: () => void;
}

export const useReportsStore = create<ReportsStore>((set) => ({
  userReports: [],
  addReport: (report) => {
    set((state) => {
      // Generate ID baru (ambil ID terakhir + 1, atau mulai dari 101 jika belum ada data)
      const maxId =
        state.userReports.length > 0
          ? Math.max(...state.userReports.map((item) => item.id))
          : 100;
      const newId = maxId + 1;

      const newReport: MarkerData = {
        ...report,
        id: newId,
      };

      return {
        userReports: [...state.userReports, newReport],
      };
    });
  },
  removeReport: (id) => {
    set((state) => ({
      userReports: state.userReports.filter((report) => report.id !== id),
    }));
  },
  clearReports: () => {
    set({ userReports: [] });
  },
}));

