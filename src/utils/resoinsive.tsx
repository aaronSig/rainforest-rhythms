import React from "react";
import Responsive from "react-responsive";

export const Desktop = (props: any) => <Responsive {...props} minWidth={992} />;
export const Tablet = (props: any) => <Responsive {...props} minWidth={768} maxWidth={991} />;
export const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;
export const Default = (props: any) => <Responsive {...props} minWidth={768} />;
