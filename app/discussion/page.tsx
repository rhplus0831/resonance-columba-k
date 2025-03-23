"use client";
import Giscus from "@giscus/react";
export default function DiscussionPage() {
  return (
    <div className="bg-white/30 dark:bg-gray-800/30 p-12 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-500/5 rounded-lg backdrop-blur-lg max-w-4xl mx-auto my-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <Giscus
          id="comments"
          repo="pinisok/resonance-columba-k"
          repoId="R_kgDOOJEgNQ"
          mapping="number"
          term="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="ko"
          loading="lazy"
        />
      </div>
    </div>
  );
}
