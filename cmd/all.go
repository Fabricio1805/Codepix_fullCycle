/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os"

	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/grpc"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/kafka"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/infrastructure/db"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/spf13/cobra"
)

var (
	gRPCPortNumber int
)
// allCmd represents the all command
var allCmd = &cobra.Command{
	Use:   "all",
	Short: "Run gRPC and a Kafka Consumer",
	
	Run: func(cmd *cobra.Command, args []string) {
		database := db.ConnectDB(os.Getenv("env"))
		go grpc.StartGrpcServer(database, portNumber)

		deliveryChan := make(chan ckafka.Event)
		producer := kafka.NewKafkaProducer()
	
		//kafka.Publish("Ola Consumer", "teste", producer, deliveryChan)
		go kafka.DeliveryReport(deliveryChan)

		kafkaProcessor := kafka.NewKafkaProcessor(database, producer, deliveryChan)
		kafkaProcessor.Consume()

	},
}

func init() {
	rootCmd.AddCommand(allCmd)
	allCmd.Flags().IntVarP(&gRPCPortNumber, "grpc-port", "p", 50051,"gRPC Port")
	
}
