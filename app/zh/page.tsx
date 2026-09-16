import type { Metadata } from "next";
import { Portfolio } from "../components/Portfolio";

const description =
  "Smartrick，一名正在往技术美术方向走的学习者。作品集包含 Unity、Shader Graph、HLSL、C# 工具与 URP 实时渲染的实践项目。";

export const metadata: Metadata = {
  title: "Smartrick — 技术美术",
  description,
  keywords: [
    "技术美术",
    "TA",
    "Unity",
    "Shader Graph",
    "HLSL",
    "URP",
    "实时渲染",
    "特效",
    "C#",
    "作品集",
  ],
  alternates: {
    canonical: "/zh",
    languages: {
      en: "/",
      "zh-CN": "/zh",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Smartrick — 技术美术",
    description: "艺术 × 代码 × AI，一个还在长的实时图形作品集。",
    url: "/zh",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    title: "Smartrick — 技术美术",
    description: "艺术 × 代码 × AI，一个还在长的实时图形作品集。",
  },
};

export default function Page() {
  return <Portfolio lang="zh" />;
}
