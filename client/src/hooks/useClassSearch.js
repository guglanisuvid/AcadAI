import { useState, useEffect } from 'react';

const useClassSearch = (initialClasses = []) => {
    const [classes, setClasses] = useState(initialClasses);
    const [filteredClasses, setFilteredClasses] = useState(initialClasses);

    useEffect(() => {
        setFilteredClasses(classes);
    }, [classes]);

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredClasses(classes);
            return;
        }

        const searchTerm = query.toLowerCase();
        const filtered = classes.filter(classItem =>
            classItem.title.toLowerCase().includes(searchTerm) ||
            classItem.description.toLowerCase().includes(searchTerm)
        );
        setFilteredClasses(filtered);
    };

    return {
        classes,
        setClasses,
        filteredClasses,
        handleSearch
    };
};

export default useClassSearch; 