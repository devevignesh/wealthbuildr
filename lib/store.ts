import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface ChartDataPoint {
  year: number;
  wealth: number;
}

interface AbundantDataPoint {
  year: number;
  wealth: number;
}

interface AccumulationPhase {
  monthlyInvestment: number;
  interest: number;
  goal: number;
  wealth: number;
  savingPeriod: number;
  data: ChartDataPoint[];
}

interface GrowthPhase {
  monthlyInvestment: number;
  interest: number;
  goal: number;
  savingPeriod: number;
  wealth: number;
  data: ChartDataPoint[];
}

interface AbundantPhase {
  wealth: number;
  data: AbundantDataPoint[];
  combinedData: ChartDataPoint[];
  abundantPhaseAge: number;
  combinedNetWorth: number;
}

interface Settings {
  age: number;
  inflation: number;
  savingsRate: number;
  salary: number;
  expense: number;
  targetExpenseToSave: number; // New field for 50x target
  showAlert: boolean;
}

interface StoreInterface {
  accumulationPhase: AccumulationPhase;
  growthPhase: GrowthPhase;
  abundantPhase: AbundantPhase;
  settings: Settings;
  inflationToggle: boolean;
  mergePhases: () => void;
  setAccumulationPhase: (newData: Partial<AccumulationPhase>) => void;
  setGrowthPhase: (newData: Partial<GrowthPhase>) => void;
  setAbundantPhase: (newData: Partial<AbundantPhase>) => void;
  setSettings: (newData: Partial<Settings>) => void;
  setInflationToggle: () => void;
  calculateTargetExpense: (expense: number) => number;
}

type MyPersist = (
  config: (set: any, get: any, api: any) => StoreInterface,
  options: PersistOptions<StoreInterface>
) => (set: any, get: any, api: any) => StoreInterface;

export const useStore = create<StoreInterface>(
  (persist as MyPersist)(
    (set, get) => ({
      accumulationPhase: {
        monthlyInvestment: 30000,
        interest: 12,
        goal: 5,
        wealth: 500,
        savingPeriod: 1,
        data: []
      },
      growthPhase: {
        monthlyInvestment: 30000,
        interest: 12,
        goal: 25,
        savingPeriod: 1,
        wealth: 500,
        data: []
      },
      abundantPhase: {
        wealth: 1000,
        combinedNetWorth: 1000,
        combinedData: [],
        abundantPhaseAge: 1,
        data: []
      },
      settings: {
        inflation: 0,
        savingsRate: 6,
        salary: 2500000,
        age: 30,
        expense: 600000,
        targetExpenseToSave: 30000000,
        showAlert: true
      },
      inflationToggle: false,
      calculateTargetExpense: (expense: number) => {
        const growthPhaseGoal = get().growthPhase.goal;
        return expense * (growthPhaseGoal * 2);
      },
      calculateAbundantPhaseAge: () =>
        set((state: StoreInterface) => {
          const initialAge = state.settings.age;
          const accumulationPeriod = state.accumulationPhase.savingPeriod;
          const growthPeriod = state.growthPhase.savingPeriod;
          const abundantPhaseAge =
            initialAge + accumulationPeriod + growthPeriod;

          return {
            ...state,
            abundantPhase: {
              ...state.abundantPhase,
              abundantPhaseAge
            }
          };
        }),
      mergePhases: () =>
        set((state: StoreInterface) => {
          const accumulationData = state.accumulationPhase.data;
          const growthData = state.growthPhase.data;
          const abundantData = state.abundantPhase.data;

          const combinedData = [
            ...accumulationData,
            ...growthData.map(point => ({
              ...point,
              year: point.year + accumulationData.length
            }))
          ];

          return {
            ...state,
            abundantPhase: {
              combinedNetWorth:
                combinedData[combinedData.length - 1]?.wealth || 0,
              combinedData: combinedData
            }
          };
        }),
      setAccumulationPhase: newData =>
        set((state: StoreInterface) => {
          const updatedState = {
            ...state,
            accumulationPhase: {
              ...state.accumulationPhase,
              ...newData
            }
          };
          setTimeout(() => {
            updatedState.mergePhases();
            get().calculateAbundantPhaseAge();
          }, 0);
          return updatedState;
        }),
      setGrowthPhase: newData =>
        set((state: StoreInterface) => {
          const updatedState = {
            ...state,
            growthPhase: {
              ...state.growthPhase,
              ...newData
            }
          };
          setTimeout(() => {
            updatedState.mergePhases();
            get().calculateAbundantPhaseAge();
          }, 0);
          return updatedState;
        }),
      setAbundantPhase: newData =>
        set((state: StoreInterface) => {
          const updatedAbundantPhase = {
            ...state.abundantPhase,
            ...newData
          };

          // Calculate the offset for the abundant phase data
          const offset =
            state.accumulationPhase.data.length + state.growthPhase.data.length;

          // Update combinedData by concatenating existing data with new abundant phase data
          const updatedCombinedData = [
            ...state.abundantPhase.combinedData.slice(0, offset),
            ...updatedAbundantPhase.data.map(point => ({
              ...point,
              year: point.year + offset
            }))
          ];

          return {
            ...state,
            abundantPhase: {
              ...updatedAbundantPhase,
              combinedData: updatedCombinedData
            }
          };
        }),
      setSettings: newData =>
        set((state: StoreInterface) => {
          const updatedSettings = {
            ...state.settings,
            ...newData,
            showAlert: false
          };

          // Recalculate targetExpenseToSave if expense has changed
          if ("expense" in newData) {
            updatedSettings.targetExpenseToSave = get().calculateTargetExpense(
              updatedSettings.expense
            );
          }

          return {
            ...state,
            settings: updatedSettings
          };
        }),
      setInflationToggle: () =>
        set((state: StoreInterface) => ({
          inflationToggle: !get().inflationToggle
        }))
    }),
    {
      name: "wealth-data"
    }
  )
);
