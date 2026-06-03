import { Prisma, Unit } from "@prisma/client";

// Dimension categories
export type Dimension = "WEIGHT" | "VOLUME" | "COUNT";

/**
 * Retrieves the physical dimension of a specific Unit enum.
 */
export function getUnitDimension(unit: Unit): Dimension {
  switch (unit) {
    case "G":
    case "KG":
      return "WEIGHT";
    case "ML":
    case "L":
      return "VOLUME";
    case "ITEM":
      return "COUNT";
  }
}

/**
 * Retrieves the base internal storage unit for a physical dimension.
 */
export function getBaseUnit(dimension: Dimension): Unit {
  switch (dimension) {
    case "WEIGHT":
      return "G";
    case "VOLUME":
      return "ML";
    case "COUNT":
      return "ITEM";
  }
}

/**
 * Converts a quantity value from any input Unit to its base storage Unit.
 * - KG -> G (value * 1000)
 * - L -> ML (value * 1000)
 * - G, ML, ITEM are left as-is (they are the base units)
 */
export function convertToBaseUnit(value: Prisma.Decimal | number | string, inputUnit: Unit): Prisma.Decimal {
  const decValue = new Prisma.Decimal(value);

  switch (inputUnit) {
    case "KG":
      return decValue.mul(1000); // 1 KG = 1000 G
    case "L":
      return decValue.mul(1000); // 1 L = 1000 ML
    case "G":
    case "ML":
    case "ITEM":
    default:
      return decValue;
  }
}

/**
 * Converts a base storage unit quantity to a target display Unit.
 * - G -> KG (value / 1000)
 * - ML -> L (value / 1000)
 * - G, ML, ITEM are left as-is
 */
export function convertFromBaseUnit(valueInBase: Prisma.Decimal | number | string, targetUnit: Unit): Prisma.Decimal {
  const decValue = new Prisma.Decimal(valueInBase);

  switch (targetUnit) {
    case "KG":
      return decValue.div(1000); // G -> KG
    case "L":
      return decValue.div(1000); // ML -> L
    case "G":
    case "ML":
    case "ITEM":
    default:
      return decValue;
  }
}

/**
 * Converts a quantity from one unit directly to another compatible unit.
 * Throws an error if the units belong to different physical dimensions (e.g. converting Liters to Grams).
 */
export function convertUnit(
  value: Prisma.Decimal | number | string,
  fromUnit: Unit,
  toUnit: Unit
): Prisma.Decimal {
  const fromDim = getUnitDimension(fromUnit);
  const toDim = getUnitDimension(toUnit);

  if (fromDim !== toDim) {
    throw new Error(
      `Incompatible Unit Conversion: Cannot convert unit '${fromUnit}' (${fromDim}) to '${toUnit}' (${toDim}).`
    );
  }

  // Double-hop: Convert to base unit first, then convert from base to target
  const baseValue = convertToBaseUnit(value, fromUnit);
  return convertFromBaseUnit(baseValue, toUnit);
}

/**
 * Computes the transaction cost for a requested purchase quantity,
 * converting the user's input quantity to match the product's catalog unit pricing.
 * 
 * Example: Catalog pricing is $18.50 per Liter. User requests 200 mL.
 * 1. Convert 200 mL to Liters -> 0.2000 L.
 * 2. Calculate: 0.2000 L * $18.50/L = $3.70.
 */
export function calculatePrice(
  catalogPricePerUnit: Prisma.Decimal | number | string,
  requestedQuantity: Prisma.Decimal | number | string,
  quantityUnit: Unit,
  catalogPriceUnit: Unit
): Prisma.Decimal {
  const unitPrice = new Prisma.Decimal(catalogPricePerUnit);
  
  // 1. Convert quantity unit to align with product catalog pricing unit
  const convertedQty = convertUnit(requestedQuantity, quantityUnit, catalogPriceUnit);
  
  // 2. Perform exact Decimal multiplication
  return unitPrice.mul(convertedQty);
}
