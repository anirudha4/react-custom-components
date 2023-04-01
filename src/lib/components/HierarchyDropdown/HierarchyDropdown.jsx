import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

// icons
import { TbChevronDown } from 'react-icons/tb'

// styles
import './styles.scss';

// constants
export const TYPES = {
    TEXT: 'TEXT',
    CHECKBOX: 'CHECKBOX',
    DATE: 'DATE'
}
export const OPTIONS = [
    { id: uuid(), label: 'Name', type: TYPES.TEXT },
    { id: uuid(), label: 'Labels', type: TYPES.CHECKBOX },
    { id: uuid(), label: 'Date', type: TYPES.DATE },
    { id: uuid(), label: 'Name', type: TYPES.TEXT },
    { id: uuid(), label: 'Labels', type: TYPES.CHECKBOX },
    { id: uuid(), label: 'Date', type: TYPES.DATE },
    { id: uuid(), label: 'Name', type: TYPES.TEXT },
    { id: uuid(), label: 'Labels', type: TYPES.CHECKBOX },
    { id: uuid(), label: 'Date', type: TYPES.DATE },
];

function HierarchyDropdown({
    /**
     * options
     * handlers
     * etc...
     */
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);

    // refs
    const dropdownRef = useRef();
    const subDropdownRef = useRef();

    // handlers
    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleChangeActiveSubDropdown = (id, component) => setActiveSubDropdown({ id, component });

    const handleRepositionOptionsMenu = (id = activeSubDropdown.id) => {
        const trigger = document.getElementById(id);
        const dropdownBounds = subDropdownRef.current.getBoundingClientRect();
        const triggerBound = trigger.getBoundingClientRect();

        let verticalOffset = 0;
        if (dropdownBounds.bottom > window.innerHeight) {
            verticalOffset = dropdownBounds.bottom - window.innerHeight;
        }

        subDropdownRef.current.style.top = triggerBound.top - verticalOffset - 10 + 'px';
        const dropdownWidth = dropdownBounds.width;
        subDropdownRef.current.style.left = (triggerBound.left - dropdownWidth - 30) + 'px';
    }


    // effects
    useEffect(() => {
        if (activeSubDropdown && subDropdownRef.current) {
            handleRepositionOptionsMenu(activeSubDropdown.id);
        }
    }, [activeSubDropdown?.id, activeSubDropdown?.component, subDropdownRef.current])

    useEffect(() => {
        if (!isOpen) {
            setActiveSubDropdown(null);
        }
    }, [isOpen])

    // handle closing scenarios
    useEffect(() => {
        const handleClose = () => setActiveSubDropdown(null);
        window.addEventListener('resize', handleClose);
        document.querySelector('.hierarchy-dropdown-menu').addEventListener('scroll', handleClose)
        return () => {
            window.removeEventListener('resize', handleClose);
            document.querySelector('.hierarchy-dropdown-menu').removeEventListener('scroll', handleClose)
        }
    }, []);
    return (
        <div className="hierarchy-dropdown" style={{ width: 300, marginInline: 'auto', marginBlock: 50 }}>
            <div className="hierarchy-dropdown-trigger" onClick={toggleDropdown}>
                <div className="hierarchy-dropdown-trigger-text">Filters</div>
                <div className="hierarchy-dropdown-trigger-icon">
                    <TbChevronDown />
                </div>
            </div>
            <div className={classNames("hierarchy-dropdown-menu", {
                'menu-open': isOpen
            })} ref={dropdownRef}>
                {isOpen && (OPTIONS.map(option => {
                    return (
                        <DropdownItem key={option.id} {...option} handleChangeActiveSubDropdown={handleChangeActiveSubDropdown} />
                    )
                })
                )}
            </div>
            {(activeSubDropdown?.component && isOpen) && (
                React.cloneElement(activeSubDropdown.component, {
                    ref: subDropdownRef
                })
            )}
        </div>
    )
}

export default HierarchyDropdown;



const DropdownItem = ({ id, label, type, handleChangeActiveSubDropdown }) => {
    // memos
    const component = useMemo(() => {
        /**
         * switch based on type
         */
        return <PlaceholderComponent type={type} />
    })

    // handlers
    const toggleDropdown = () => handleChangeActiveSubDropdown(id, component);

    return (
        <div className="hierarchy-dropdown-menu-item" onClick={toggleDropdown}>
            <div id={id} className="hierarchy-dropdown-menu-item-label">
                {label}
            </div>
        </div>
    )
}

// replace this with any component you want to render in sub dropdown
export const PlaceholderComponent = forwardRef(({ type }, ref) => {
    return (
        <div className="placeholder-component" ref={ref}>
            Placeholder {type}
        </div>
    )
});