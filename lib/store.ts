import { createStore } from "zustand";
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
  abundantSavingPeriod: number;
}

interface Settings {
  age: number;
  inflation: number;
  savingsRate: number;
  salary: number;
  expense: number;
  showAlert: boolean;
}

export interface StoreInterface {
  accumulationPhase: AccumulationPhase;
  growthPhase: GrowthPhase;
  abundantPhase: AbundantPhase;
  settings: Settings;
  inflationToggle: boolean;
  targetExpenseToSave: number;
  targetExpenseToSaveWithInflation: number;
  mergePhases: () => void;
  setAccumulationPhase: (newData: Partial<AccumulationPhase>) => void;
  setGrowthPhase: (newData: Partial<GrowthPhase>) => void;
  setAbundantPhase: (newData: Partial<AbundantPhase>) => void;
  setSettings: (newData: Partial<Settings>) => void;
  calculateTargetExpense: (expense: number) => number;
}

type MyPersist = (
  config: (set: any, get: any, api: any) => StoreInterface,
  options: PersistOptions<StoreInterface>
) => (set: any, get: any, api: any) => StoreInterface;

export const createWealthStore = () => {
  return createStore<StoreInterface>(
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
          abundantSavingPeriod: 0,
          data: []
        },
        settings: {
          inflation: 0,
          savingsRate: 6,
          salary: 2500000,
          age: 30,
          expense: 600000,
          showAlert: true
        },
        inflationToggle: false,
        targetExpenseToSave: 30000000,
        targetExpenseToSaveWithInflation: 0,
        calculateTargetExpense: (expense: number) => {
          const finalGoal = 50;
          return expense * finalGoal;
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

            let targetExpenseToSaveWithInflation = state.targetExpenseToSave;
            const years =
              state.abundantPhase.abundantPhaseAge +
              newData.abundantSavingPeriod! -
              state.settings.age;
            const inflationRate = state.settings.inflation / 100;
            targetExpenseToSaveWithInflation =
              state.targetExpenseToSave * Math.pow(1 + inflationRate, years);
            // Calculate the offset for the abundant phase data
            const offset =
              state.accumulationPhase.data.length +
              state.growthPhase.data.length;

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
              },
              targetExpenseToSaveWithInflation: Math.round(
                targetExpenseToSaveWithInflation
              )
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
              state.targetExpenseToSave = get().calculateTargetExpense(
                updatedSettings.expense
              );
            }

            // Set inflationToggle to true if inflation is greater than 0
            const inflationToggle = updatedSettings.inflation > 0;

            return {
              ...state,
              settings: updatedSettings,
              inflationToggle
            };
          })
      }),
      {
        name: "wealth-data"
      }
    )
  );
};
