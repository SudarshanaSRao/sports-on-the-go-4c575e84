export interface EmojiData {
  emoji: string;
  keywords: string[];
}

export interface SportEmojisData {
  popular: EmojiData[];
  ballSports: EmojiData[];
  activities: EmojiData[];
  winter: EmojiData[];
  water: EmojiData[];
  combat: EmojiData[];
  target: EmojiData[];
  other: EmojiData[];
}

export const sportEmojis: SportEmojisData = {
  popular: [
    { emoji: '⚽', keywords: ['soccer', 'football', 'ball'] },
    { emoji: '🏀', keywords: ['basketball', 'ball', 'hoops'] },
    { emoji: '🏈', keywords: ['football', 'american', 'ball'] },
    { emoji: '⚾', keywords: ['baseball', 'ball'] },
    { emoji: '🎾', keywords: ['tennis', 'ball'] },
    { emoji: '🏐', keywords: ['volleyball', 'ball'] },
    { emoji: '🏸', keywords: ['badminton', 'shuttlecock'] },
    { emoji: '🏒', keywords: ['hockey', 'ice', 'field'] },
    { emoji: '🏑', keywords: ['field hockey', 'stick'] },
    { emoji: '🥏', keywords: ['frisbee', 'disc', 'ultimate'] },
    { emoji: '🎯', keywords: ['target', 'darts', 'bullseye'] },
    { emoji: '🏉', keywords: ['rugby', 'ball'] },
  ],
  ballSports: [
    { emoji: '⚽', keywords: ['soccer', 'football', 'ball'] },
    { emoji: '🏀', keywords: ['basketball', 'ball', 'hoops'] },
    { emoji: '🏈', keywords: ['football', 'american', 'ball'] },
    { emoji: '⚾', keywords: ['baseball', 'ball'] },
    { emoji: '🎾', keywords: ['tennis', 'ball'] },
    { emoji: '🏐', keywords: ['volleyball', 'ball'] },
    { emoji: '🏉', keywords: ['rugby', 'ball'] },
    { emoji: '🥎', keywords: ['softball', 'ball'] },
    { emoji: '🎱', keywords: ['billiards', 'pool', '8ball'] },
    { emoji: '🏓', keywords: ['ping pong', 'table tennis'] },
    { emoji: '🏸', keywords: ['badminton', 'shuttlecock'] },
    { emoji: '⛳', keywords: ['golf', 'flag', 'hole'] },
  ],
  activities: [
    { emoji: '🏃', keywords: ['running', 'jogging', 'sprint'] },
    { emoji: '🚴', keywords: ['cycling', 'biking', 'bicycle'] },
    { emoji: '🏊', keywords: ['swimming', 'pool', 'water'] },
    { emoji: '🤸', keywords: ['gymnastics', 'cartwheel', 'flip'] },
    { emoji: '🏋️', keywords: ['weightlifting', 'gym', 'strength'] },
    { emoji: '🧗', keywords: ['climbing', 'rock', 'boulder'] },
    { emoji: '🤾', keywords: ['handball', 'throwing'] },
    { emoji: '🏇', keywords: ['horse racing', 'equestrian'] },
    { emoji: '⛹️', keywords: ['basketball', 'dribbling', 'person'] },
    { emoji: '🤺', keywords: ['fencing', 'sword', 'epee'] },
    { emoji: '🧘', keywords: ['yoga', 'meditation', 'stretching'] },
    { emoji: '🤼', keywords: ['wrestling', 'grappling'] },
  ],
  winter: [
    { emoji: '⛷️', keywords: ['skiing', 'downhill', 'snow'] },
    { emoji: '🏂', keywords: ['snowboarding', 'snow', 'board'] },
    { emoji: '⛸️', keywords: ['ice skating', 'figure skating'] },
    { emoji: '🏒', keywords: ['ice hockey', 'puck', 'stick'] },
    { emoji: '🥌', keywords: ['curling', 'stone', 'ice'] },
    { emoji: '🛷', keywords: ['sledding', 'toboggan', 'snow'] },
  ],
  water: [
    { emoji: '🏊', keywords: ['swimming', 'pool', 'freestyle'] },
    { emoji: '🏄', keywords: ['surfing', 'wave', 'board'] },
    { emoji: '🚣', keywords: ['rowing', 'boat', 'crew'] },
    { emoji: '🤽', keywords: ['water polo', 'ball', 'pool'] },
    { emoji: '⛵', keywords: ['sailing', 'boat', 'wind'] },
    { emoji: '🤿', keywords: ['diving', 'scuba', 'snorkel'] },
    { emoji: '🏊‍♂️', keywords: ['swimming', 'man', 'pool'] },
    { emoji: '🛟', keywords: ['life preserver', 'float', 'safety'] },
  ],
  combat: [
    { emoji: '🥊', keywords: ['boxing', 'gloves', 'fight'] },
    { emoji: '🥋', keywords: ['martial arts', 'karate', 'judo'] },
    { emoji: '🤺', keywords: ['fencing', 'sword', 'foil'] },
    { emoji: '🤼', keywords: ['wrestling', 'grappling', 'mma'] },
    { emoji: '🥷', keywords: ['ninja', 'martial arts', 'stealth'] },
  ],
  target: [
    { emoji: '🎯', keywords: ['darts', 'target', 'bullseye'] },
    { emoji: '🏹', keywords: ['archery', 'bow', 'arrow'] },
    { emoji: '⛳', keywords: ['golf', 'flag', 'putting'] },
    { emoji: '🎱', keywords: ['pool', 'billiards', '8ball'] },
    { emoji: '🎳', keywords: ['bowling', 'pins', 'strike'] },
    { emoji: '🪃', keywords: ['boomerang', 'throwing'] },
  ],
  other: [
    { emoji: '🎪', keywords: ['circus', 'tent', 'performance'] },
    { emoji: '🎮', keywords: ['video games', 'esports', 'gaming'] },
    { emoji: '🎲', keywords: ['dice', 'board games', 'tabletop'] },
    { emoji: '🧩', keywords: ['puzzle', 'jigsaw', 'brain'] },
    { emoji: '♟️', keywords: ['chess', 'strategy', 'board'] },
    { emoji: '🪁', keywords: ['kite', 'flying', 'wind'] },
    { emoji: '🛹', keywords: ['skateboard', 'skate', 'tricks'] },
    { emoji: '🛼', keywords: ['roller skating', 'inline', 'skates'] },
    { emoji: '🪂', keywords: ['parachute', 'skydiving', 'paragliding'] },
    { emoji: '🏹', keywords: ['archery', 'bow', 'arrow'] },
    { emoji: '🎣', keywords: ['fishing', 'rod', 'catch'] },
    { emoji: '🤹', keywords: ['juggling', 'balls', 'circus'] },
  ],
};

export const emojiCategories = [
  { id: 'popular', label: 'Popular Sports', icon: '⭐' },
  { id: 'ballSports', label: 'Ball Sports', icon: '⚽' },
  { id: 'activities', label: 'Activities', icon: '🏃' },
  { id: 'winter', label: 'Winter', icon: '⛷️' },
  { id: 'water', label: 'Water', icon: '🏊' },
  { id: 'combat', label: 'Combat', icon: '🥊' },
  { id: 'target', label: 'Target', icon: '🎯' },
  { id: 'other', label: 'Other', icon: '🎪' },
] as const;
