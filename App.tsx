import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Switch } from 'react-native';
import Slider from '@react-native-community/slider';

// Define the structure of our stats
interface Stat {
  name: string;
  value: number;
  isPercentage: boolean;
  category: string;
  maxValue: number;
  tier?: number;  // Add tier information
}

interface Source {
  id: string;
  name: string;
  enabled: boolean;
  stats: Stat[];
  color: string;
}

// Update the color constants
const CARD_COLORS = {
  red: '#4D3B3B',    // Lighter Red
  green: '#3B4D3B',  // Lighter Green
  yellow: '#4D4D3B', // Lighter Yellow
  blue: '#3B3B4D',   // Lighter Blue
  ash: '#3B3B3B',    // Lighter Gray
  purple: '#4D3B4D', // Lighter Purple
};

const THEME = {
  background: '#2A2A2A',      // Lighter background
  surface: '#363636',        // Lighter surface
  primary: '#BB86FC',        // Primary color (Purple)
  secondary: '#03DAC6',      // Secondary color (Teal)
  error: '#CF6679',          // Error color
  text: {
    primary: '#FFFFFF',      // Primary text
    secondary: '#E0E0E0',    // Lighter secondary text
    disabled: '#A0A0A0',     // Lighter disabled text
  },
  divider: '#404040',        // Lighter divider
  overlay: 'rgba(0, 0, 0, 0.2)', // Lighter overlay
};

// Add color variations for UI elements
const COLOR_VARIATIONS = {
  red: {
    light: '#5D4B4B',
    medium: '#4D3B3B',
    dark: '#3D2B2B',
    accent: '#FF6B6B',
  },
  green: {
    light: '#4B5D4B',
    medium: '#3B4D3B',
    dark: '#2B3D2B',
    accent: '#6BFF6B',
  },
  yellow: {
    light: '#5D5D4B',
    medium: '#4D4D3B',
    dark: '#3D3D2B',
    accent: '#FFFF6B',
  },
  blue: {
    light: '#4B4B5D',
    medium: '#3B3B4D',
    dark: '#2B2B3D',
    accent: '#6B6BFF',
  },
  ash: {
    light: '#4B4B4B',
    medium: '#3B3B3B',
    dark: '#2B2B2B',
    accent: '#CCCCCC',
  },
  purple: {
    light: '#5D4B5D',
    medium: '#4D3B4D',
    dark: '#3D2B3D',
    accent: '#BB86FC',
  },
};

// Initial global stats configuration
const INITIAL_STATS: Stat[] = [
  // Attack Stats
  { name: "Attack Power", value: 0, isPercentage: true, category: "Attack Stats", maxValue: 28 },
  { name: "Attack Speed", value: 0, isPercentage: true, category: "Attack Stats", maxValue: 145 },
  { name: "Physical Crit Chance", value: 0, isPercentage: true, category: "Attack Stats", maxValue: 45 },
  { name: "Physical Crit Power", value: 0, isPercentage: true, category: "Attack Stats", maxValue: 180 },
  { name: "Weapon Skill Power", value: 0, isPercentage: true, category: "Attack Stats", maxValue: 144 },
  { name: "Weapon Charge Gain", value: 0, isPercentage: false, category: "Attack Stats", maxValue: 35 },

  // Skill Stats
  { name: "Skill Power", value: 0, isPercentage: true, category: "Skill Stats", maxValue: 35 },
  { name: "Skill Crit Chance", value: 0, isPercentage: true, category: "Skill Stats", maxValue: 45 },
  { name: "Skill Crit Power", value: 0, isPercentage: true, category: "Skill Stats", maxValue: 155 },
  { name: "Ultimate Power", value: 0, isPercentage: true, category: "Skill Stats", maxValue: 155 },
  { name: "Summon Damage", value: 0, isPercentage: true, category: "Skill Stats", maxValue: 160 },
  { name: "Skill Charge Gain", value: 0, isPercentage: false, category: "Skill Stats", maxValue: 35 },

  // Defense & Health Stats
  { name: "Movement Speed", value: 0, isPercentage: false, category: "Defense & Health", maxValue: 23 },
  { name: "Damage Reduction", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 20 },
  { name: "Shield Effectiveness", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 50 },
  { name: "Max Health", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 40 },
  { name: "Health Regen (Out of Combat)", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 100 },
  { name: "Health Received", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 60 },
  { name: "Attack Leech", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 25 },
  { name: "Weapon Skill Leech", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 25 },
  { name: "Skill Leech", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 25 },
  { name: "Base Type Efficiency", value: 0, isPercentage: true, category: "Defense & Health", maxValue: 50 },

  // Cooldown Stats
  { name: "Weapon Cooldown", value: 0, isPercentage: true, category: "Cooldowns", maxValue: 39 },
  { name: "Skill Cooldown", value: 0, isPercentage: true, category: "Cooldowns", maxValue: 40 },
  { name: "Veil Cooldown", value: 0, isPercentage: true, category: "Cooldowns", maxValue: 40 },
  { name: "Ultimate Cooldown", value: 0, isPercentage: true, category: "Cooldowns", maxValue: 70 },
];

// Add weapon-specific stats constant
const WEAPON_STATS = [
  { name: "Max Health", value: 16, isPercentage: true, category: "Defense & Health", maxValue: 40 },
  { name: "Movement Speed", value: 8, isPercentage: false, category: "Defense & Health", maxValue: 23 },
  { name: "Veil Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 40 },
  { name: "Physical Power", value: 10, isPercentage: true, category: "Attack Stats", maxValue: 100 },
  { name: "Attack Speed", value: 14, isPercentage: true, category: "Attack Stats", maxValue: 145 },
  { name: "Weapon Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 39 },
  { name: "Weapon Skill Power", value: 16, isPercentage: true, category: "Attack Stats", maxValue: 144 },
  { name: "Physical Crit Chance", value: 16, isPercentage: true, category: "Attack Stats", maxValue: 45 },
  { name: "Physical Crit Power", value: 16, isPercentage: true, category: "Attack Stats", maxValue: 180 },
  { name: "Skill Power", value: 14, isPercentage: true, category: "Skill Stats", maxValue: 35 },
  { name: "Skill Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 40 },
  { name: "Skill Crit Chance", value: 16, isPercentage: true, category: "Skill Stats", maxValue: 45 },
  { name: "Skill Crit Power", value: 16, isPercentage: true, category: "Skill Stats", maxValue: 155 },
  { name: "Skill Leech", value: 10, isPercentage: true, category: "Defense & Health", maxValue: 25 }
];

// Initial blood type sources
const INITIAL_SOURCES: Source[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Physical Power", value: 10, isPercentage: true, category: "Attack Stats", maxValue: 100, tier: 1 },
      { name: "Weapon Skill Power", value: 30, isPercentage: true, category: "Attack Stats", maxValue: 144, tier: 1 },
      { name: "Weapon Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 39, tier: 2 },
      { name: "Weapon Skill Leech", value: 5, isPercentage: true, category: "Defense & Health", maxValue: 25, tier: 2 },
      { name: "Weapon Skill Power", value: 20, isPercentage: true, category: "Attack Stats", maxValue: 144, tier: 3 },
      { name: "Weapon Charge Gain", value: 12, isPercentage: false, category: "Attack Stats", maxValue: 35, tier: 4 }
    ]
  },
  {
    id: 'brute',
    name: 'Brute',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Attack Speed", value: 14, isPercentage: true, category: "Attack Stats", maxValue: 145, tier: 1 },
      { name: "Physical Power", value: 5, isPercentage: true, category: "Attack Stats", maxValue: 100, tier: 1 },
      { name: "Attack Leech", value: 10, isPercentage: true, category: "Defense & Health", maxValue: 25, tier: 2 },
      { name: "Damage Reduction", value: 4, isPercentage: true, category: "Defense & Health", maxValue: 20, tier: 2 },
      { name: "Max Health", value: 20, isPercentage: true, category: "Defense & Health", maxValue: 40, tier: 3 }
    ]
  },
  {
    id: 'rogue',
    name: 'Rogue',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Physical Crit Chance", value: 16, isPercentage: true, category: "Attack Stats", maxValue: 45, tier: 1 },
      { name: "Physical Crit Power", value: 8, isPercentage: true, category: "Attack Stats", maxValue: 180, tier: 1 },
      { name: "Movement Speed", value: 8, isPercentage: false, category: "Defense & Health", maxValue: 23, tier: 2 },
      { name: "Veil Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 40, tier: 3 }
    ]
  },
  {
    id: 'creature',
    name: 'Creature',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Max Health", value: 20, isPercentage: true, category: "Defense & Health", maxValue: 40, tier: 1 },
      { name: "Health Regen (Out of Combat)", value: 40, isPercentage: true, category: "Defense & Health", maxValue: 100, tier: 1 },
      { name: "Movement Speed", value: 8, isPercentage: false, category: "Defense & Health", maxValue: 23, tier: 2 },
      { name: "Health Received", value: 24, isPercentage: true, category: "Defense & Health", maxValue: 60, tier: 3 }
    ]
  },
  {
    id: 'scholar',
    name: 'Scholar',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Skill Power", value: 14, isPercentage: true, category: "Skill Stats", maxValue: 35, tier: 1 },
      { name: "Shield Effectiveness", value: 10, isPercentage: true, category: "Defense & Health", maxValue: 50, tier: 1 },
      { name: "Skill Cooldown", value: 14, isPercentage: true, category: "Cooldowns", maxValue: 40, tier: 2 },
      { name: "Ultimate Power", value: 20, isPercentage: true, category: "Skill Stats", maxValue: 155, tier: 3 },
      { name: "Skill Charge Gain", value: 12, isPercentage: false, category: "Skill Stats", maxValue: 35, tier: 4 }
    ]
  },
  {
    id: 'draculin',
    name: 'Draculin',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Skill Power", value: 14, isPercentage: true, category: "Skill Stats", maxValue: 35, tier: 1 },
      { name: "Skill Crit Power", value: 8, isPercentage: true, category: "Skill Stats", maxValue: 155, tier: 1 },
      { name: "Skill Crit Chance", value: 16, isPercentage: true, category: "Skill Stats", maxValue: 45, tier: 2 },
      { name: "Skill Leech", value: 10, isPercentage: true, category: "Defense & Health", maxValue: 25, tier: 3 },
      { name: "Skill Charge Gain", value: 3, isPercentage: false, category: "Skill Stats", maxValue: 35, tier: 3 }
    ]
  },
  {
    id: 'mutant',
    name: 'Mutant',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Skill Power", value: 14, isPercentage: true, category: "Skill Stats", maxValue: 35, tier: 1 },
      { name: "Ultimate Power", value: 20, isPercentage: true, category: "Skill Stats", maxValue: 155, tier: 3 },
      { name: "Ultimate Cooldown", value: 28, isPercentage: true, category: "Cooldowns", maxValue: 70, tier: 2 },
      { name: "Summon Damage", value: 12, isPercentage: true, category: "Skill Stats", maxValue: 160, tier: 3 },
      { name: "Veil Cooldown", value: 7, isPercentage: true, category: "Cooldowns", maxValue: 40, tier: 4 }
    ]
  },
  {
    id: 'worker',
    name: 'Worker',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Movement Speed", value: 20, isPercentage: false, category: "Defense & Health", maxValue: 23, tier: 1 }
    ]
  },
  {
    id: 'corrupted',
    name: 'Corrupted',
    enabled: true,
    color: 'red',
    stats: [
      { name: "Damage Reduction", value: 25, isPercentage: true, category: "Defense & Health", maxValue: 20, tier: 1 },
      { name: "Attack Leech", value: 5, isPercentage: true, category: "Defense & Health", maxValue: 25, tier: 1 },
      { name: "Movement Speed", value: 8, isPercentage: false, category: "Defense & Health", maxValue: 23, tier: 3 },
      { name: "Attack Speed", value: 18, isPercentage: true, category: "Attack Stats", maxValue: 145, tier: 3 },
      { name: "Skill Charge Gain", value: 15, isPercentage: false, category: "Skill Stats", maxValue: 35, tier: 4 },
      { name: "Weapon Charge Gain", value: 15, isPercentage: false, category: "Attack Stats", maxValue: 35, tier: 4 }
    ]
  }
];

// Add these new interfaces after the existing interfaces
interface TabItem {
  id: string;
  label: string;
  color: string;
}

// Update the TABS constant to include Custom tabs for each color
const TABS: TabItem[] = [
  { id: 'blood-types', label: 'Blood Types', color: 'red' },
  { id: 'elemental', label: 'Elemental Awakenings', color: 'yellow' },
  { id: 'vampire', label: 'Vampire Awakenings', color: 'blue' },
  { id: 'custom-green', label: 'Weapons', color: 'green' },
  { id: 'custom-ash', label: 'Custom Ash', color: 'ash' },
  { id: 'custom-purple', label: 'Custom Purple', color: 'purple' }
];

// Change sorting options to filter options
const FILTER_OPTIONS = [
  { value: 'none', label: 'Show All' },
  { value: 'name', label: 'Has Name' },
  ...INITIAL_STATS.map(stat => ({ value: stat.name, label: `Has ${stat.name}` }))
];

const SliderComponent = ({ label, value, setValue, max = 200, isPercentage = false, color = THEME.primary }) => (
  <View style={styles.sliderContainer}>
    <Text style={styles.label}>{label}: {value}{isPercentage ? '%' : ''}</Text>
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={max}
      value={value}
      onValueChange={setValue}
      minimumTrackTintColor={color}
      maximumTrackTintColor={THEME.divider}
      thumbTintColor={color}
      step={1}
    />
  </View>
);

const StatDisplay = ({ stat, totalValue }: { stat: Stat; totalValue: number }) => {
  const isOvercapped = totalValue > stat.maxValue;
  const overcapAmount = isOvercapped ? totalValue - stat.maxValue : 0;
  const color = isOvercapped ? THEME.error : THEME.primary;
  
  return (
    <View style={styles.statContainer}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{stat.name}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.statValue, isOvercapped && styles.overcappedValue]}>
            {totalValue.toFixed(1)} / {stat.maxValue}{stat.isPercentage ? '%' : ''}
            {isOvercapped && <Text style={styles.overcapText}> (+{overcapAmount.toFixed(1)})</Text>}
          </Text>
        </View>
      </View>
      <View style={styles.statValueContainer}>
        <View 
          style={[
            styles.statBar, 
            { width: `${Math.min(100, (totalValue / stat.maxValue) * 100)}%` },
            isOvercapped && styles.overcappedBar,
            { backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

const CategorySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{title}</Text>
    {children}
  </View>
);

const ColorSelector = ({ selectedColor, onColorSelect }) => (
  <View style={styles.colorSelector}>
    {Object.entries(CARD_COLORS).map(([colorName, colorValue]) => (
      <TouchableOpacity
        key={colorName}
        style={[
          styles.colorOption,
          { backgroundColor: colorValue },
          selectedColor === colorName && styles.selectedColor
        ]}
        onPress={() => onColorSelect(colorName)}
      />
    ))}
  </View>
);

const SourceCard = ({ 
  source, 
  onToggle, 
  onDuplicate, 
  onAddStat,
  selectedStat,
  setSelectedStat,
  statValue,
  setStatValue 
}) => {
  const colorVariations = COLOR_VARIATIONS[source.color];
  const isWeapon = source.color === 'green';
  
  // Group stats by tier
  const statsByTier: Record<number, Stat[]> = source.stats.reduce((acc, stat) => {
    const tier = stat.tier || 1;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(stat);
    return acc;
  }, {} as Record<number, Stat[]>);

  return (
    <View 
      style={[
        styles.sourceCard,
        { backgroundColor: colorVariations.medium }
      ]}
    >
      <View style={styles.sourceHeader}>
        <Text style={styles.sourceName}>{source.name}</Text>
        <View style={styles.sourceControls}>
          <TouchableOpacity 
            style={[
              styles.duplicateButton,
              { backgroundColor: colorVariations.light }
            ]}
            onPress={onDuplicate}
          >
            <Text style={styles.duplicateButtonText}>Duplicate</Text>
          </TouchableOpacity>
          <Switch
            value={source.enabled}
            onValueChange={onToggle}
            trackColor={{ 
              false: colorVariations.dark, 
              true: colorVariations.accent 
            }}
            thumbColor={source.enabled ? colorVariations.accent : THEME.text.secondary}
            ios_backgroundColor={colorVariations.dark}
          />
        </View>
      </View>
      
      {/* Display stats grouped by tier */}
      {Object.entries(statsByTier).map(([tier, stats]) => (
        <View key={tier} style={[styles.tierSection, { backgroundColor: colorVariations.dark }]}>
          <Text style={styles.tierTitle}>Tier {tier}</Text>
          {stats.map(stat => (
            <View key={stat.name} style={styles.sourceStat}>
              <Text style={styles.statText}>
                {stat.name}: {stat.value}{stat.isPercentage ? '%' : ''}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {/* Add Stat to Source */}
      <View style={styles.addStatForm}>
        <View style={styles.selectContainer}>
          <select
            value={selectedStat || ''}
            onChange={(e) => setSelectedStat(e.target.value)}
            style={{
              ...styles.select,
              backgroundColor: colorVariations.light,
              color: THEME.text.primary,
              borderColor: THEME.divider,
              width: '100%',
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
          >
            <option value="">Select Stat</option>
            {(isWeapon ? WEAPON_STATS : INITIAL_STATS).map(stat => (
              <option key={stat.name} value={stat.name}>
                {stat.name}
              </option>
            ))}
          </select>
        </View>
        {!isWeapon && (
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colorVariations.light }
            ]}
            value={statValue}
            onChangeText={setStatValue}
            keyboardType="numeric"
            placeholder="Value"
            placeholderTextColor={THEME.text.secondary}
          />
        )}
        <TouchableOpacity 
          style={[
            styles.addStatButton,
            { backgroundColor: colorVariations.light }
          ]}
          onPress={onAddStat}
        >
          <Text style={styles.addStatButtonText}>Add Stat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Tab = ({ tab, isActive, onPress }) => {
  const colorVariations = COLOR_VARIATIONS[tab.color];
  
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        { backgroundColor: colorVariations.medium },
        isActive && [styles.activeTab, { borderColor: colorVariations.accent }]
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.tabText,
        isActive && { color: colorVariations.accent }
      ]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [globalStats, setGlobalStats] = useState<Stat[]>(INITIAL_STATS);
  const [sources, setSources] = useState<Source[]>(() => {
    // Try to load saved sources from localStorage
    const savedSources = localStorage.getItem('sources');
    if (savedSources) {
      try {
        const parsedSources = JSON.parse(savedSources);
        if (Array.isArray(parsedSources) && parsedSources.length > 0) {
          return parsedSources;
        }
      } catch (error) {
        console.error('Error loading saved sources:', error);
      }
    }
    return INITIAL_SOURCES;
  });
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [statValue, setStatValue] = useState('0');
  const [activeTab, setActiveTab] = useState('blood-types');
  const [filterBy, setFilterBy] = useState('none');

  // Save sources to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sources', JSON.stringify(sources));
  }, [sources]);

  // Update calculateTotalStats to properly handle disabled sources
  const calculateTotalStats = () => {
    return INITIAL_STATS.map(baseStat => {
      const totalValue = sources.reduce((sum, source) => {
        if (source.enabled) {
          const sourceStat = source.stats.find(s => s.name === baseStat.name);
          return sum + (sourceStat?.value || 0);
        }
        return sum;
      }, 0);

      return {
        ...baseStat,
        value: totalValue
      };
    });
  };

  const totalStats = calculateTotalStats();

  // Replace sorting function with filtering function
  const getFilteredSources = () => {
    const tabFilteredSources = sources.filter(source => {
      switch (activeTab) {
        case 'blood-types':
          return source.color === 'red' && !source.name.includes('Awakening');
        case 'elemental':
          return source.color === 'yellow';
        case 'vampire':
          return source.color === 'blue';
        case 'custom-green':
          return source.color === 'green';
        case 'custom-ash':
          return source.color === 'ash';
        case 'custom-purple':
          return source.color === 'purple';
        default:
          return true;
      }
    });

    if (filterBy === 'none') return tabFilteredSources;
    if (filterBy === 'name') return tabFilteredSources.filter(source => source.name);
    
    return tabFilteredSources.filter(source => 
      source.stats.some(stat => stat.name === filterBy)
    );
  };

  const addNewSource = () => {
    if (!newSourceName.trim()) return;

    const newSource: Source = {
      id: Date.now().toString(),
      name: newSourceName,
      enabled: false,
      stats: [],
      color: selectedColor
    };

    setSources(prevSources => [...prevSources, newSource]);
    setNewSourceName('');
    setSelectedColor('red');
    setIsAddingSource(false);
  };

  const toggleSource = (sourceId: string) => {
    setSources(prevSources => 
      prevSources.map(source => 
        source.id === sourceId 
          ? { ...source, enabled: !source.enabled }
          : source
      )
    );
  };

  const addStatToSource = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;

    if (source.color === 'green') {
      // For weapons, use the predefined stats with their maximum values
      if (!selectedStat) return;
      
      const weaponStat = WEAPON_STATS.find(s => s.name === selectedStat);
      if (!weaponStat) return;

      setSources(prevSources => 
        prevSources.map(s => {
          if (s.id === sourceId) {
            const existingStat = s.stats.find(stat => stat.name === selectedStat);
            if (existingStat) {
              return s; // Don't modify existing stats
            } else {
              // Add the weapon stat with tier 1
              return {
                ...s,
                stats: [...s.stats, { ...weaponStat, tier: 1 }]
              };
            }
          }
          return s;
        })
      );
    } else {
      // Original logic for non-weapon sources
      if (!selectedStat || !statValue) return;

      setSources(prevSources => 
        prevSources.map(s => {
          if (s.id === sourceId) {
            const existingStat = s.stats.find(stat => stat.name === selectedStat);
            if (existingStat) {
              return {
                ...s,
                stats: s.stats.map(stat => 
                  stat.name === selectedStat 
                    ? { ...stat, value: parseFloat(statValue) }
                    : stat
                )
              };
            } else {
              const baseStat = INITIAL_STATS.find(stat => stat.name === selectedStat)!;
              return {
                ...s,
                stats: [...s.stats, {
                  name: selectedStat,
                  value: parseFloat(statValue),
                  isPercentage: baseStat.isPercentage,
                  category: baseStat.category,
                  maxValue: baseStat.maxValue,
                  tier: 1
                }]
              };
            }
          }
          return s;
        })
      );
    }

    setSelectedStat(null);
    setStatValue('0');
  };

  const duplicateSource = (sourceId: string) => {
    const sourceToDuplicate = sources.find(s => s.id === sourceId);
    if (!sourceToDuplicate) return;

    const newSource: Source = {
      ...sourceToDuplicate,
      id: Date.now().toString(),
      name: `${sourceToDuplicate.name} (Copy)`,
      enabled: false,
    };

    setSources(prevSources => [...prevSources, newSource]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Global Stats</Text>

        {/* Global Stats Display */}
        {Object.entries(
          totalStats.reduce((acc, stat) => {
            if (!acc[stat.category]) acc[stat.category] = [];
            acc[stat.category].push(stat);
            return acc;
          }, {} as Record<string, Stat[]>)
        ).map(([category, stats]) => (
          <CategorySection key={category} title={category}>
            {stats.map(stat => (
              <StatDisplay 
                key={stat.name} 
                stat={stat} 
                totalValue={stat.value}
              />
            ))}
          </CategorySection>
        ))}

        {/* Sources Section */}
        <View style={styles.sourcesSection}>
          <Text style={styles.sectionTitle}>Sources</Text>
          
          {/* Tab Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollView}
          >
            {TABS.map(tab => (
              <Tab
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onPress={() => setActiveTab(tab.id)}
              />
            ))}
          </ScrollView>

          {/* Filter Dropdown */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by:</Text>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={styles.filterSelect}
            >
              {FILTER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </View>

          {/* Add New Source Button */}
          {!isAddingSource ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsAddingSource(true)}
            >
              <Text style={styles.addButtonText}>Add New Source</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addSourceForm}>
              <TextInput
                style={styles.input}
                value={newSourceName}
                onChangeText={setNewSourceName}
                placeholder="Source Name"
              />
              <Text style={styles.colorSelectorLabel}>Select Card Color:</Text>
              <ColorSelector
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addNewSource}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsAddingSource(false);
                  setSelectedColor('red');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Source Cards */}
          {getFilteredSources().map(source => (
            <SourceCard
              key={source.id}
              source={source}
              onToggle={() => toggleSource(source.id)}
              onDuplicate={() => duplicateSource(source.id)}
              onAddStat={() => addStatToSource(source.id)}
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
              statValue={statValue}
              setStatValue={setStatValue}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: THEME.text.primary,
  },
  categorySection: {
    marginBottom: 16,
    backgroundColor: THEME.surface,
    borderRadius: 9,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.92,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME.primary,
  },
  sliderContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13.5,
    marginBottom: 3.5,
    color: THEME.text.secondary,
  },
  slider: {
    width: '100%',
    height: 35,
  },
  statContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3.5,
  },
  statLabel: {
    fontSize: 13.5,
    color: THEME.text.secondary,
    flex: 1,
  },
  valueContainer: {
    flex: 0,
    minWidth: 95,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 13.5,
    color: THEME.text.primary,
    textAlign: 'right',
  },
  overcappedValue: {
    color: THEME.error,
  },
  statValueContainer: {
    height: 22,
    backgroundColor: THEME.background,
    borderRadius: 11,
    overflow: 'hidden',
    position: 'relative',
  },
  statBar: {
    position: 'absolute',
    height: '100%',
    opacity: 0.7,
  },
  overcappedBar: {
    backgroundColor: THEME.error,
  },
  overcapText: {
    color: THEME.error,
    fontWeight: 'bold',
  },
  sourcesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME.text.primary,
  },
  addButton: {
    backgroundColor: THEME.primary,
    padding: 9,
    borderRadius: 4.5,
    marginBottom: 12,
    alignSelf: 'center',
  },
  addButtonText: {
    color: THEME.text.primary,
    textAlign: 'center',
    fontSize: 15,
  },
  sourceCard: {
    backgroundColor: 'transparent',
    borderRadius: 9,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.92,
    elevation: 4,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  sourceStat: {
    marginBottom: 4,
    padding: 4.5,
    backgroundColor: 'transparent',
    borderRadius: 3.5,
  },
  statText: {
    fontSize: 13.5,
    color: THEME.text.primary,
  },
  addSourceForm: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.divider,
    borderRadius: 4.5,
    padding: 7,
    backgroundColor: THEME.surface,
    color: THEME.text.primary,
    minWidth: 200,
    maxWidth: 300,
  },
  selectContainer: {
    minWidth: 200,
    maxWidth: 300,
  },
  select: {
    borderWidth: 1,
    borderRadius: 4.5,
    padding: 7,
    backgroundColor: THEME.surface,
    color: THEME.text.primary,
  },
  saveButton: {
    backgroundColor: THEME.secondary,
    padding: 9,
    borderRadius: 4.5,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: THEME.text.primary,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: THEME.error,
    padding: 9,
    borderRadius: 4.5,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: THEME.text.primary,
    textAlign: 'center',
  },
  addStatForm: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  addStatButton: {
    padding: 7,
    borderRadius: 4.5,
    alignSelf: 'center',
  },
  addStatButtonText: {
    color: THEME.text.primary,
    textAlign: 'center',
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  colorOption: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: THEME.divider,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  colorSelectorLabel: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginBottom: 4,
  },
  sourceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duplicateButton: {
    padding: 7,
    borderRadius: 4.5,
    alignSelf: 'center',
  },
  duplicateButtonText: {
    color: THEME.text.primary,
    fontSize: 11.5,
  },
  tierSection: {
    marginBottom: 8,
    padding: 7,
    backgroundColor: 'transparent',
    borderRadius: 4.5,
  },
  tierTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    marginBottom: 6,
    color: THEME.text.secondary,
  },
  tabContainer: {
    marginBottom: 12,
  },
  tabScrollView: {
    flexGrow: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 18,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.divider,
  },
  activeTab: {
    borderWidth: 2,
  },
  tabText: {
    fontSize: 13.5,
    color: THEME.text.primary,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
    gap: 8,
  },
  filterLabel: {
    color: THEME.text.primary,
    fontSize: 14,
  },
  filterSelect: {
    backgroundColor: THEME.surface,
    color: THEME.text.primary,
    borderWidth: 1,
    borderColor: THEME.divider,
    borderRadius: 4,
    padding: 6,
    minWidth: 150,
  },
}); 