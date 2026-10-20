<template>
  <div class="px-4 py-10 sm:px-6 sm:py-14">
    <div class="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
      <h1 class="text-6xl font-light leading-[0.9] tracking-[-0.06em] text-white sm:text-8xl">Your stashes</h1>
      <p class="font-mono text-xs uppercase tracking-wide text-neutral-500">
        {{ stashes.length }} {{ stashes.length === 1 ? "stash" : "stashes" }} / In this browser
      </p>
    </div>

    <div v-if="!stashes.length" class="mt-10">
      <p class="max-w-2xl text-neutral-400">Nothing here yet. Stashes you make in this browser show up here until they expire.</p>
      <a href="/" class="link mt-8 inline-block font-mono text-xs uppercase tracking-wide">← New stash</a>
    </div>

    <!-- Mosaic grid (DESIGN.md): groups of three, one 2x2 tile alternating sides, leftovers widen so there are no holes -->
    <div v-else class="mosaic mt-10">
      <a v-for="(stash, i) in stashes" :key="stash.id" :href="`/${stash.id}`" class="tile" :class="sizeOf(i)">
        <div class="top font-mono">
          <time :datetime="new Date(stash.createdAt).toISOString()">{{ date(stash.createdAt) }}</time>
          <span>{{ syntaxName(stash.syntax) }}</span>
        </div>
        <span class="num font-mono" aria-hidden="true">{{ String(stashes.length - i).padStart(2, "0") }}</span>
        <div>
          <h2>{{ stash.title }}</h2>
          <p class="sum font-mono">
            {{ stash.lines }} {{ stash.lines === 1 ? "line" : "lines" }} /
            {{ stash.once ? "One read only" : `Expires in ${timeLeft(stash.expiresAt)}` }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { syntaxName } from "../helpers/highlighters";
import { date, timeLeft } from "../helpers/format";
import { saved } from "../services/stash";

const stashes = saved();

const full = stashes.length - (stashes.length % 3);
const sizeOf = (i: number) => {
  if (i < full) return i % 3 ? "" : Math.floor(i / 3) % 2 ? "big right" : "big";
  return stashes.length - full === 1 ? "wide-3" : i === full ? "wide-2" : "";
};
</script>

<style scoped>
.mosaic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: dense;
  gap: 2px;
}
.tile {
  aspect-ratio: 1;
  min-width: 0;
  background: rgb(var(--tile));
  padding: clamp(14px, 2vw, 28px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: background-color .25s, color .25s;
}
.tile:nth-child(4n+2) { background: rgb(var(--tile-2)); }
.tile:nth-child(5n+3) { background: rgb(var(--tile-3)); }
.tile:hover, .tile:focus-visible { background: rgb(var(--invert)); color: rgb(var(--page)); outline: none; }

.big { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
.big.right { grid-column: 2 / span 2; }
.wide-2 { grid-column: span 2; aspect-ratio: auto; }
.wide-3 { grid-column: span 3; aspect-ratio: auto; min-height: 260px; }

.top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .04em;
  opacity: .55;
}
.num {
  font-size: clamp(40px, 7vw, 96px);
  letter-spacing: -.05em;
  line-height: 1;
  color: rgb(var(--number));
  transition: color .25s;
}
.big .num { font-size: clamp(80px, 14vw, 200px); }
.tile:hover .num, .tile:focus-visible .num { color: rgb(var(--page)); }

h2 {
  font-size: clamp(15px, 1.6vw, 20px);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -.01em;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.big h2 { font-size: clamp(24px, 3.4vw, 44px); letter-spacing: -.03em; }
.sum { color: rgb(var(--muted)); font-size: 12px; text-transform: uppercase; letter-spacing: .025em; margin-top: 14px; }
.tile:hover .sum, .tile:focus-visible .sum { color: rgb(var(--page) / .72); }
.tile:not(.big) .sum { display: none; }

@media (max-width: 720px) {
  .mosaic { grid-template-columns: 1fr 1fr; }
  .big, .big.right, .wide-3 { grid-column: span 2; aspect-ratio: 1; min-height: 0; }
  .wide-2 { grid-column: auto; aspect-ratio: 1; }
  .top span { display: none; }
  h2 { font-size: 14px; }
  .big h2 { font-size: 24px; }
}
</style>
