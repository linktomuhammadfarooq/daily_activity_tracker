function safeRound(value, decimals = 2) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function getUnitColorClass(unit) {
  if (unit < 150) {
    return "bg-green-100 text-green-800 ring-green-200";
  }

  if (unit <= 185) {
    return "bg-yellow-100 text-yellow-800 ring-yellow-200";
  }

  return "bg-red-100 text-red-800 ring-red-200";
}

function canShareMeter({ ownerId, currentUserId, isSuperAdmin }) {
  return isSuperAdmin || ownerId === currentUserId;
}

module.exports = {
  safeRound,
  getUnitColorClass,
  canShareMeter,
};
