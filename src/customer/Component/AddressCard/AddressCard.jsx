const AddressCard = ({address}) => {
  const fullName =
    [address?.firstName, address?.lastName].filter(Boolean).join(" ") ||
    address?.name ||
    address?.fullName ||
    "";

  const street =
    address?.streetAddress ||
    address?.address ||
    address?.addressLine1 ||
    address?.line1 ||
    address?.street ||
    "-";

  const city = address?.city || address?.town || address?.district || "-";
  const state = address?.state || address?.region || address?.province || "-";
  const pin =
    address?.pinCode ||
    address?.postalCode ||
    address?.zipCode ||
    address?.zip ||
    address?.pincode ||
    "-";

  const phone =
    address?.mobile ||
    address?.phoneNumber ||
    address?.phone ||
    address?.contactNumber ||
    "Not available";

  const hasUsableAddress = Boolean(
    [street, city, state, pin].some((value) => value && value !== "-")
  );

  if (!hasUsableAddress) {
    return (
      <div className="text-left">
        <p className="font-semibold">No saved address</p>
      </div>
    );
  }

  return (
    <div className="text-left">
      <div className="space-y-3">
        <p className="font-semibold">{fullName || "Saved Address"}</p>
        <p>{street}</p>
        <p>{city}, {state} - {pin}</p>
        <div className="space-y-1">
          <p className="font-semibold">Phone Number</p>
          <p>{phone}</p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
