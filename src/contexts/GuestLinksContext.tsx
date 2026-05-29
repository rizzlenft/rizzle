import { createContext, useContext } from "react";
import { guestVideoLinks } from "@/data/guestData";

export type GuestLinksMap = Record<string, string | string[]>;

const GuestLinksContext = createContext<GuestLinksMap>(guestVideoLinks);

export const GuestLinksProvider = ({
  links,
  children,
}: {
  links: GuestLinksMap;
  children: React.ReactNode;
}) => (
  <GuestLinksContext.Provider value={links}>{children}</GuestLinksContext.Provider>
);

export const useGuestLinks = () => useContext(GuestLinksContext);
