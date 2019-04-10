import { importMDX } from "mdx.macro";
import React, { lazy, Suspense } from "react";
import Article from "../Article/Article";

const Content = lazy(() => importMDX("../../markdown/about.mdx"));

interface AboutProps {
  path: string;
}

function About(props: AboutProps) {
  return (
    <Article>
      <Suspense fallback={<div style={{ height: "100vh" }}>Loading...</div>}>
        <Content />
      </Suspense>
    </Article>
  );
}

export default About;
