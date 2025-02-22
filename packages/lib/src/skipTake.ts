export function skipTake(page : number, pageSize : number) {
  return {
    skip : (page - 1) * pageSize,
    take : pageSize
  }
}