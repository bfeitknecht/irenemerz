# Live testing / development environment for irenemerz.ch.
# Builds the static site into dist/ and serves it on port 8000.
#
#   docker build -t irenemerz .
#   docker run --rm -p 8000:8000 irenemerz
#
# For development with live files mounted (rebuilds on each start):
#   docker run --rm -p 8000:8000 -v "$PWD":/site irenemerz
FROM denoland/deno:2.9.7

WORKDIR /site

# Cache dependencies first so source edits don't invalidate the layer.
COPY deno.json deno.lock ./
RUN deno install

COPY src ./src
COPY tools ./tools

# Render the site into dist/ and serve it.
RUN deno task build

EXPOSE 8000
CMD ["deno", "task", "serve", "0.0.0.0:8000"]