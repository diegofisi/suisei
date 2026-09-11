/** Below (or at) this width the page stacks in one column and every stage stops being sticky. */
export const NARROW_MAX_WIDTH = 760;
export const NARROW_MEDIA = `@media (max-width: ${NARROW_MAX_WIDTH}px)`;
export const WIDE_MEDIA = `@media (min-width: ${NARROW_MAX_WIDTH + 1}px)`;

export const isNarrowViewport = (viewportWidth: number): boolean => viewportWidth <= NARROW_MAX_WIDTH;
