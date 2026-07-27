import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const MultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3' },
    { id: 4, label: 'Option 4' },
    { id: 5, label: 'Option 5' }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event) => {
    const optionId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    }
  };

  return (
    <div className={`dropdown ${isOpen ? 'show' : ''}`}>
      <button
        style={{width:"100%" ,backgroundColor:'white',textAlign: 'left'}}
        className="btn btn-secondary  form-select"
        type="button"
        id="multiSelectDropdown"
        onClick={toggleDropdown}
      >
      
        Select Options  {/*JSON.stringify(selectedOptions)*/}
      </button>
      <div style={{width:"100%",borderRadius:0,borderBlock:'5px'}} className={`dropdown-menu  ${isOpen ? 'show' : ''}`} aria-labelledby="multiSelectDropdown">
        {options.map((option) => (
            <Form style={{backgroundColor:selectedOptions.includes(option.id) ? '#1E90FF' : 'white'}}>
          <Form.Check
          style={{margin:"4px"}}
            key={option.id}
            type="checkbox"
            id={`option_${option.id}`}
            label={option.label}
            checked={selectedOptions.includes(option.id)}
            onChange={handleOptionChange}
            value={option.id}
          />
          </Form>
        ))}
      </div>
     
    </div>
  );
};

export default MultiSelectDropdown;