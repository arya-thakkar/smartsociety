// services/amenity.service.js

const Amenity = require("../models/amenity.model");

const getAmenities = async (societyId) => {
  return Amenity.find({ society: societyId });
};

const addAmenity = async (societyId, amenityData) => {
  return Amenity.create({ ...amenityData, society: societyId, slots: [] });
};

const updateAmenity = async (societyId, amenityId, updates) => {
  const amenity = await Amenity.findOneAndUpdate(
    { _id: amenityId, society: societyId },
    updates,
    { new: true }
  );
  if (!amenity) throw { status: 404, message: "Amenity not found" };
  return amenity;
};

// ── Slot management (admin adds/removes from dashboard) ──────────

const addSlot = async (societyId, amenityId, slotData) => {
  const amenity = await Amenity.findOneAndUpdate(
    { _id: amenityId, society: societyId },
    { $push: { slots: slotData } },
    { new: true }
  );
  if (!amenity) throw { status: 404, message: "Amenity not found" };
  return amenity;
};

const updateSlot = async (societyId, amenityId, slotId, updates) => {
  const amenity = await Amenity.findOneAndUpdate(
    { _id: amenityId, society: societyId, "slots._id": slotId },
    { $set: { "slots.$": { _id: slotId, ...updates } } },
    { new: true }
  );
  if (!amenity) throw { status: 404, message: "Amenity or slot not found" };
  return amenity;
};

const deleteSlot = async (societyId, amenityId, slotId) => {
  const amenity = await Amenity.findOneAndUpdate(
    { _id: amenityId, society: societyId },
    { $pull: { slots: { _id: slotId } } },
    { new: true }
  );
  if (!amenity) throw { status: 404, message: "Amenity not found" };
  return amenity;
};

module.exports = { getAmenities, addAmenity, updateAmenity, addSlot, updateSlot, deleteSlot };
