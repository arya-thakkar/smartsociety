// controllers/amenity.controller.js
const amenityService = require("../services/amenity.service");

const getAmenities  = async (req, res, next) => { try { const amenities = await amenityService.getAmenities(req.user.society); res.json({ success: true, amenities }); } catch (err) { next(err); } };
const addAmenity    = async (req, res, next) => { try { const amenity = await amenityService.addAmenity(req.user.society, req.body); res.status(201).json({ success: true, amenity }); } catch (err) { next(err); } };
const updateAmenity = async (req, res, next) => { try { const amenity = await amenityService.updateAmenity(req.user.society, req.params.id, req.body); res.json({ success: true, amenity }); } catch (err) { next(err); } };

// Slot controllers
const addSlot    = async (req, res, next) => { try { const amenity = await amenityService.addSlot(req.user.society, req.params.id, req.body); res.status(201).json({ success: true, amenity }); } catch (err) { next(err); } };
const updateSlot = async (req, res, next) => { try { const amenity = await amenityService.updateSlot(req.user.society, req.params.id, req.params.slotId, req.body); res.json({ success: true, amenity }); } catch (err) { next(err); } };
const deleteSlot = async (req, res, next) => { try { const amenity = await amenityService.deleteSlot(req.user.society, req.params.id, req.params.slotId); res.json({ success: true, amenity }); } catch (err) { next(err); } };

module.exports = { getAmenities, addAmenity, updateAmenity, addSlot, updateSlot, deleteSlot };
