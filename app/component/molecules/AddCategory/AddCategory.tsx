import styled from 'styled-components';
import { Input } from '../../atoms/Input';
import { Flex } from '../../atoms/Basic';
import { useEffect, useState } from 'react';
import { Button } from '../../atoms/Button';
import { useAuthContext } from '../../../../context/authContext';
import Picker from 'emoji-picker-react';
import { addCategory } from '../../../utils/api';

interface AddCategoryProps {
  authToken: string;
  handleClose: () => void;
  onSuccess: () => void;
}

export const AddCategory = ({
  authToken,
  handleClose,
  onSuccess,
}: AddCategoryProps) => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(0);
  const [chosenIcon, setChosenIcon] = useState('');
  const [openIconPicker, setOpenIconPicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    icon: boolean;
    name: boolean;
    budget: boolean;
  }>({ icon: false, name: false, budget: false });
  const onIconClick = (event: { emoji: string }) => {
    setOpenIconPicker(false);
    setChosenIcon(event.emoji);
  };

  if (!user) return null;

  const closeAddCategory = () => {
    handleClose();
    setName('');
    setBudget(0);
  };

  const handleAddCategory = async () => {
    if (chosenIcon === '')
      return setValidationErrors((prev) => ({ ...prev, icon: true }));
    if (name === '')
      return setValidationErrors((prev) => ({ ...prev, name: true }));
    if (budget === 0)
      return setValidationErrors((prev) => ({ ...prev, budget: true }));

    let data: {
      name: string;
      icon: string;
      budget: number;
    } = {
      icon: chosenIcon,
      budget: budget,
      name,
    };
    const { error } = await addCategory(authToken, data);
    if (error) {
      console.log(error);
    } else {
      onSuccess();
    }
    closeAddCategory();
  };

  return (
    <DialogContent>
      <h3>Add a category</h3>
      <br />
      <h4>Ex: 🥦 = vegetables</h4>
      <br />
      {openIconPicker && (
        <PickerContainer>
          <Flex d="column" a="center">
            <Picker
              open={openIconPicker}
              onEmojiClick={onIconClick}
              previewConfig={{
                showPreview: false,
              }}
            />
            <Button
              name="Close"
              onClick={() => setOpenIconPicker(false)}
              margin="10px"
            />
          </Flex>
        </PickerContainer>
      )}
      <Flex a="center" j="space-around">
        <IconButton
          variant="circle"
          name={chosenIcon || '🤍'}
          onClick={() => {
            setValidationErrors((prev) => ({ ...prev, icon: false }));
            setOpenIconPicker(true);
          }}
          error={validationErrors.icon}
          border="2px solid #f0f0f0"
        />
        =
        <Input
          width="100px"
          height="40px"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValidationErrors((prev) => ({ ...prev, name: false }));
            setName(e.target.value);
          }}
          margin="0 10px "
          placeholder="name ?"
          error={validationErrors.name}
        />
      </Flex>
      <Input
        width="150px"
        value={budget === 0 ? '' : budget}
        placeholder={'Budget ?'}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValidationErrors((prev) => ({ ...prev, budget: false }));
          setBudget(parseInt(e.target.value));
        }}
        margin="20px 0 20px 0"
        error={validationErrors.budget}
      />
      <Flex a="center" j="center">
        <Button
          type="button"
          onClick={handleAddCategory}
          name="Add"
          margin="0 10px 0 0"
        />
        <Button
          type="button"
          onClick={closeAddCategory}
          name="Close"
          variant="secondary"
        />
      </Flex>
    </DialogContent>
  );
};

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

const IconButton = styled(Button)`
  height: 90px;
  width: 90px;
  background-color: inherit;
  font-size: 30px;
  text-align: center;
`;

const PickerContainer = styled.div`
  position: absolute;
`;
