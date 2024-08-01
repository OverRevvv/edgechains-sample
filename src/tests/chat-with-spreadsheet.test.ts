import { test, expect } from "vitest";

test("should be return expected answer", async () => {
    const res = await fetch("http://localhost:3000/chatWithSheet?question=how many people live in India");

    const data = await res.json();
    expect(data.res).toString();
}, 8000);
