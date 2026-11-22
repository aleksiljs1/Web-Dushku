// A wardrobe built from divs so its doors can swing open in real 3D.
// The parent animates .door-l / .door-r rotateY.
export default function Wardrobe() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-[78%] max-w-[300px] [perspective:900px]" aria-hidden>
      {/* body */}
      <div className="absolute inset-0 rounded-[10px] bg-walnut p-[5%] shadow-[0_30px_60px_-20px_rgba(42,29,20,.45)]">
        <div className="wood-grain absolute inset-0 rounded-[10px] opacity-40" />
        {/* interior */}
        <div className="relative grid h-full grid-cols-2 gap-[4%] rounded-[4px] bg-[#3f2817] p-[5%] shadow-[inset_0_8px_20px_rgba(0,0,0,.35)]">
          {/* hanging side */}
          <div className="relative">
            <div className="absolute inset-x-0 top-[8%] h-[3px] rounded bg-birch/80" />
            {["#b4582b", "#e3c9a0", "#7d8b5a", "#f4eee4"].map((c, i) => (
              <div key={c} className="absolute top-[8%]" style={{ left: `${10 + i * 21}%` }}>
                <div className="mx-auto h-2 w-[2px] bg-birch/80" />
                <div className="h-[clamp(70px,18vw,110px)] w-[clamp(14px,4vw,22px)] rounded-b-md rounded-t-[40%]" style={{ backgroundColor: c }} />
              </div>
            ))}
          </div>
          {/* shelves */}
          <div className="flex flex-col justify-between">
            {[0, 1, 2].map((s) => (
              <div key={s} className="relative flex h-[22%] items-end justify-center gap-[6%] border-b-[3px] border-oak pb-[2px]">
                <div className="h-[45%] w-[38%] rounded-sm bg-sand" />
                <div className="h-[30%] w-[30%] rounded-sm bg-copper-soft" />
              </div>
            ))}
            <div className="grid h-[20%] gap-1">
              <div className="rounded-sm bg-oak" />
              <div className="rounded-sm bg-oak" />
            </div>
          </div>
        </div>
      </div>
      {/* doors */}
      <div className="door-l absolute top-[5%] bottom-[5%] left-[5%] w-[45%] origin-left rounded-[4px] bg-oak">
        <div className="wood-grain absolute inset-0 rounded-[4px] opacity-50" />
        <div className="absolute inset-[7%] rounded-[3px] border border-walnut/25" />
        <div className="absolute top-1/2 right-[9%] h-[18%] w-[5px] -translate-y-1/2 rounded-full bg-[#d8b46a] shadow" />
      </div>
      <div className="door-r absolute top-[5%] right-[5%] bottom-[5%] w-[45%] origin-right rounded-[4px] bg-oak">
        <div className="wood-grain absolute inset-0 rounded-[4px] opacity-50" style={{ backgroundPositionX: "120px" }} />
        <div className="absolute inset-[7%] rounded-[3px] border border-walnut/25" />
        <div className="absolute top-1/2 left-[9%] h-[18%] w-[5px] -translate-y-1/2 rounded-full bg-[#d8b46a] shadow" />
      </div>
      {/* feet */}
      <div className="absolute -bottom-3 left-[8%] h-3 w-3 rounded-b bg-ink" />
      <div className="absolute right-[8%] -bottom-3 h-3 w-3 rounded-b bg-ink" />
    </div>
  );
}
