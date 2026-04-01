import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <Link
        href="/notes"
        className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
      >
        Notes
      </Link>
      <Link
        href="/login"
        className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
      >
        Login
      </Link>
      <Link
        href="/mail-test"
        className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
      >
        メールテスト
      </Link>
    </main>
  );
}
