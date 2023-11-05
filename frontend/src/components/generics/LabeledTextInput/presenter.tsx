import React from "react";
import { Text, TextInput, View } from "react-native";
import { Props as ContainerProps } from "./index";
import styles from "./style";

type Props = {} & ContainerProps;

const LabeledTextInputPresenter = ({ labelName, placeholder, style }: Props) => {
  return (
    <View style={[style]}>
      <Text style={styles.label}>{labelName}</Text>
      <TextInput
        style={[styles.input]}
        placeholder={placeholder ?? labelName}
        placeholderTextColor="#888888"
      />
    </View>
  );
};

export default LabeledTextInputPresenter;
