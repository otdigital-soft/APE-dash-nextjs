export const businessMinimalClient = (nftId: string, currentTotalClients?: number) => {
  if (typeof currentTotalClients == undefined || currentTotalClients == null) return
  switch (nftId) {
    case '56':
      return currentTotalClients + 8
    case '15':
      return currentTotalClients + 5
    case '51':
      return currentTotalClients + 8
    default:
      return currentTotalClients
  }
}
