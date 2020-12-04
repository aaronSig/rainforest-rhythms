import { importMDX } from "mdx.macro";
import React, { lazy, Suspense } from "react";
import Article from "../Article/Article";

const Content = lazy(() => importMDX("../../markdown/accessibility.mdx"));

interface AccessibilityProps {
  path: string;
}

function Accessibility(props: AccessibilityProps) {
  return (
    <Article>
      <Suspense fallback={<div style={{ height: "100vh" }}>Loading...</div>}>
        <Content />
      </Suspense>
    </Article>
  );
}

export default Accessibility;
