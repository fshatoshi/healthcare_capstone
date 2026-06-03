package com.healthtrack.api.repository;

import com.healthtrack.api.entity.EHRImportJob;
import com.healthtrack.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EHRImportJobRepository extends MongoRepository<EHRImportJob, String> {
    Optional<EHRImportJob> findByIdAndUser(String id, User user);
}
