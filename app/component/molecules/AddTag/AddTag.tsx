import styled from 'styled-components';
import { Input } from '../../atoms/Input';
import { Flex } from '../../atoms/Basic';
import { useEffect, useState } from 'react';
import { Button } from '../../atoms/Button';
import { addTag } from '../../../../firebase/firestore/addData';
import { useAuthContext } from '../../../../context/authContext';
import Picker from 'emoji-picker-react';

interface AddTagProps {
  handleClose: (arg: boolean) => void;
}

const DialogContent = styled.div`
  background-color: white;
  margin: auto;
  padding: 20px;
  border-radius: 15px;
  color: black;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmojiButton = styled(Button)`
  height: 90px;
  width: 90px;
  background-color: inherit;
  font-size: 30px;
  text-align: center;
`;

const PickerContainer = styled.div`
  position: absolute;
`;

export const AddTag = ({ handleClose }: AddTagProps) => {
  const { user } = useAuthContext();
  const [addTagSmiley, setAddTagSmiley] = useState('');
  const [addTagDesc, setAddTagDesc] = useState('');
  const [addTagBudget, setAddTagBudget] = useState('');
  const [chosenEmoji, setChosenEmoji] = useState('');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    emoji: boolean;
    name: boolean;
  }>({ emoji: false, name: false });
  const onEmojiClick = (event: { emoji: string }) => {
    setOpenEmojiPicker(false);
    setChosenEmoji(event.emoji);
  };

  if (!user) return null;

  const closeAddTag = () => {
    handleClose(false);
    setAddTagDesc('');
    setAddTagBudget('');
    setAddTagSmiley('');
  };

  const handleAddTag = async () => {
    if (chosenEmoji === '')
      return setValidationErrors((prev) => ({ ...prev, emoji: true }));
    if (addTagDesc === '')
      return setValidationErrors((prev) => ({ ...prev, name: true }));

    let data: {
      tag: string;
      description: string;
      spent: number;
      budget?: number;
    } = {
      tag: chosenEmoji,
      description: addTagDesc,
      spent: 0,
    };
    if (addTagBudget) {
      data = { ...data, budget: parseInt(addTagBudget) };
    }
    const { error } = await addTag(user.uid, data);
    if (error) {
      console.log(error);
    }
    closeAddTag();
  };

  return (
    <DialogContent>
      <h3>#Add_a_Tag</h3>
      <br />
      <h4>Ex: 🥦 = vegetables</h4>
      <br />
      {openEmojiPicker && (
        <PickerContainer>
          <Flex d="column" a="center">
            <Picker
              open={openEmojiPicker}
              onEmojiClick={onEmojiClick}
              previewConfig={{
                showPreview: false,
              }}
            />
            <Button
              name="Close"
              onClick={() => setOpenEmojiPicker(false)}
              margin="10px"
            />
          </Flex>
        </PickerContainer>
      )}
      <Flex a="center" j="space-around">
        <EmojiButton
          variant="circle"
          name={chosenEmoji || '🤍'}
          onClick={() => {
            setValidationErrors((prev) => ({ ...prev, emoji: false }));
            setOpenEmojiPicker(true);
          }}
          error={validationErrors.emoji}
          border="2px solid #f0f0f0"
        />
        =
        <Input
          width="100px"
          height="40px"
          value={addTagDesc}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValidationErrors((prev) => ({ ...prev, name: false }));
            setAddTagDesc(e.target.value);
          }}
          margin="0 10px "
          placeholder="name..."
          error={validationErrors.name}
        />
      </Flex>
      <Input
        width="150px"
        value={addTagBudget}
        placeholder="Budget ?"
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAddTagBudget(e.target.value)
        }
        margin="20px 0 20px 0"
      />
      <Flex a="center" j="center">
        <Button
          type="button"
          onClick={handleAddTag}
          name="Add"
          margin="0 10px 0 0"
        />
        <Button
          type="button"
          onClick={closeAddTag}
          name="Close"
          variant="secondary"
        />
      </Flex>
    </DialogContent>
  );
};
