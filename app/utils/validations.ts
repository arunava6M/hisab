export const emoji = (event: React.ChangeEvent<HTMLInputElement>) => {
  const {value} = event.target
  const emojiPattern = /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
  if (!emojiPattern.test(value) || value.length > 2) {
    return '';
  }
  return value
}