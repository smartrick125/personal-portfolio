import type { Metadata } from "next";
import { Portfolio } from "./components/Portfolio";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "zh-CN": "/zh",
      "x-default": "/",
    },
  },
};

export default function Page() {
  return <Portfolio lang="en" />;
}
