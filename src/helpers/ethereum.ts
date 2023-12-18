export const truncateAddress = (address: string) => {
  if (!address) return 'No address'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
