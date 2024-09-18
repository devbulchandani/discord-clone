import { Server } from '@prisma/client';
import { create } from 'zustand';
export type ModalType =
    "createServer"
    | "invite"
    | "editServer"
    | "members"
    | "createChannel"
    | "leaveServer"
    | "deleteServer"
    

interface ModelData {
    server?: Server
}

interface ModalStore {
    type: ModalType | null;
    data: ModelData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModelData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null })
}));
