import { guests as guestData } from "../Models/customerModel.js";

const fetchGuestById = (id) => guestData.find(guests => guests.id === id);
const fetchAllGuests = () => [...guestData];
const createGuest = (guests) => {
    guestData.push(guests);
    return [...guestData];
};

export const guestService = {
    fetchGuestById,
    fetchAllGuests,
    createGuest
};
