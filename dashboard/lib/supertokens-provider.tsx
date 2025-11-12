"use client";

import React from "react";
import { SuperTokensWrapper } from "supertokens-auth-react";
import SuperTokensReact from "supertokens-auth-react";
import { frontendConfig } from "./supertokens-config";

if (typeof window !== "undefined") {
  SuperTokensReact.init(frontendConfig());
}

export const SuperTokensProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
};
