<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BrandMark from './base/BrandMark.vue'
import LangSwitch from './base/LangSwitch.vue'
import { useSite } from '../composables/useSite'
import { ui } from '../config/ui'

const { t, lang, setLang } = useSite()
const labels = computed(() => ui[lang.value])
const links = computed(() => [
  { href: '#apps', label: t('navApps') },
  { href: '#stack', label: t('navTech') },
  { href: '#about', label: t('navAbout') },
  { href: '#contacto', label: t('navContact'), cta: true },
])

const open = ref(false)
const scrolled = ref(false)
const root = ref(null)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
function onKey(e) {
  if (e.key === 'Escape') open.value = false
}
function onDocClick(e) {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <header ref="root" class="nav" :class="{ 'is-scrolled': scrolled }">
    <div class="nav__inner">
      <a href="#top" class="brand" @click="open = false">
        <BrandMark />
        <span class="brand__text">Ventures FL Studio</span>
      </a>

      <nav id="site-links" class="links" :class="{ open }" :aria-label="'Principal'">
        <a v-for="l in links" :key="l.href" :href="l.href" :class="{ cta: l.cta }" @click="open = false">{{ l.label }}</a>
      </nav>

      <div class="right">
        <LangSwitch
          :model-value="lang"
          :options="[{ value: 'en', label: 'EN' }, { value: 'es', label: 'ES' }]"
          :label="labels.language"
          @update:model-value="setLang"
        />
        <button
          type="button"
          class="toggle"
          :class="{ open }"
          :aria-label="labels.menu"
          :aria-expanded="open"
          aria-controls="site-links"
          @click="open = !open"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 13, 20, 0);
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(0px);
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
}
.nav.is-scrolled {
  background: rgba(10, 13, 20, 0.72);
  border-bottom-color: var(--border);
  backdrop-filter: blur(14px);
}
.nav__inner {
  max-width: var(--maxw);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem var(--gutter);
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
}
.brand__text {
  font-weight: 600;
  font-size: 0.95rem;
}
.links {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}
.links a {
  color: var(--muted);
  font-size: 0.92rem;
  font-weight: 500;
  transition: color 0.2s;
}
.links a:hover {
  color: var(--text);
}
.links .cta {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  color: var(--text);
}
.links .cta:hover {
  border-color: var(--accent);
}
.right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.toggle {
  display: none;
  width: 44px;
  height: 44px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: none;
  border: 0;
  cursor: pointer;
}
.toggle span {
  width: 24px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: 0.3s;
}
.toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.toggle.open span:nth-child(2) {
  opacity: 0;
}
.toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 820px) {
  .links {
    position: fixed;
    inset: 66px 12px auto 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 16px;
    padding: 0.8rem;
    transform: translateY(-12px) scale(0.98);
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transition: 0.25s var(--ease-out);
  }
  .links.open {
    transform: none;
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
  }
  .links a {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 0.8rem;
    border-radius: 10px;
  }
  .links .cta {
    justify-content: center;
  }
  .toggle {
    display: flex;
  }
  .brand__text {
    display: none;
  }
}
@media (min-width: 821px) and (max-width: 960px) {
  .brand__text {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .nav,
  .links {
    transition: none;
  }
}
</style>
