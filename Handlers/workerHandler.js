import { workers } from "../Handlers/workerHandler.js";

const getWorkers = () => workers;
const getWorker = (id) => workers.find(worker => worker.id === id);
const addWorker = (newWorker) => {
    workers.push(newWorker);
};

export const workersMethods = {
    getWorkers,
    getWorker,
    addWorker
};
