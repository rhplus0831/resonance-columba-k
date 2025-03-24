import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-800 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto my-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">레조넌스 콜룸바 상공회의소</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Columba Chamber of Commerce</p>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <p className="text-gray-600 dark:text-gray-300">해당 프로젝트는 원본 프로젝트의 수정본 입니다.</p>
        <p className="text-gray-600 dark:text-gray-300">
          원본 프로젝트 Github:{" "}
          <Link href="https://github.com/nathankun/resonance-columba">
            https://github.com/nathankun/resonance-columba
          </Link>
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Github 링크:{" "}
          <Link href="https://github.com/pinisok/resonance-columba-k">
            https://github.com/pinisok/resonance-columba-k
          </Link>
        </p>
      </div>
    </div>
  );
}
