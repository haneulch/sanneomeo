# syntax=docker/dockerfile:1

# ── deps: 의존성 설치 ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── builder: Next 빌드 (standalone) ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── runner: 실행 전용 슬림 이미지 ──
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 비루트 사용자
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# standalone 출력 + 정적 자산
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 런타임에 fs로 읽는 사용자 데이터(CSV) — standalone 트레이싱 대상 아님이라 수동 복사
COPY --from=builder /app/data/store ./data/store

# CSV 쓰기 가능하도록 소유권 (데모용 로컬 영속; 프로덕션은 볼륨/DB 권장)
RUN chown -R nextjs:nodejs /app/data
USER nextjs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
