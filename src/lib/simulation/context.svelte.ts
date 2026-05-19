import { createContext } from 'svelte';
import { SimulationFormState, SimulationState } from './state.svelte';

export const [getSimulation, setSimulation] = createContext<SimulationState>();
export const [getSimulationForm, setSimulationForm] = createContext<SimulationFormState>();
