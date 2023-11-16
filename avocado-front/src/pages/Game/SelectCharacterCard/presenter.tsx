import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {Props as ContainerProps} from './index';
import styles from './style';
import CircularIcon from '../../../components/generics/CircularIcon';

type Props = {
  onPress: (characterName: string) => void;
  selectedUserId?: string;
} & ContainerProps;

const SelectCharacterCardPresenter = ({
  character,
  selectedUserId,
  onPress,
}: Props) => {
  const {icon, name, age, profession, public_info} = character;
  return (
    <Pressable style={styles.container} onPress={() => onPress(character.name)}>
      <View style={styles.nameContainer}>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/avocado-test-5e236.appspot.com/o/character_icons%2Fb.png?alt=media&token=038841ca-6718-4acc-bc2b-5bb943cb9297',
          }}
          style={styles.icon}
        />
        <Text style={styles.name}>
          {name}({age})
        </Text>
        {selectedUserId && (
          <CircularIcon
            url={{uri: selectedUserId}}
            styles={styles.selectedUserIcon}
          />
        )}
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.profession}>職業:{profession}</Text>
        <Text style={styles.description}>{[public_info]}</Text>
      </View>
    </Pressable>
  );
};

export default SelectCharacterCardPresenter;
