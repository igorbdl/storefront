import { itemToAnalyticsItem } from "apps/wake/hooks/useCart.ts";
import type a from "apps/wake/loaders/cart.ts";
import { AppContext } from "apps/wake/mod.ts";
import { Minicart } from "../../../components/minicart/Minicart.tsx";

export type Cart = Awaited<ReturnType<typeof a>>;

const locale = "pt-BR";
const currency = "BRL";

export const cartFrom = (cart: Cart): Minicart => {
  const items = cart?.products ?? [];
  const total = cart?.total ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const coupon = cart?.coupon ?? undefined;

  return {
    original: cart as unknown as Record<string, unknown>,
    data: {
      items: items?.map((item, index) => ({
        image: item!.imageUrl ?? "",
        listPrice: item!.listPrice!,
        ...itemToAnalyticsItem(item!, index),
      })),
      value,
      subtotal,
      discounts: 0,
      coupon,
    },
    options: {
      locale,
      currency,
      freeShippingTarget: 1000,
      checkoutHref: `/checkout`,
    },
  };
};

async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<Minicart> {
  const response = await ctx.invoke("wake/loaders/cart.ts");

  return cartFrom(response);
}

export default loader;
